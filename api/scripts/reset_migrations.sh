#!/usr/bin/env bash
set -e

# Ensure DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set."
  exit 1
fi

echo "Using database URL: $DATABASE_URL"

# Drop all tables, sequences, and alembic_version
echo "Dropping all tables, sequences, and alembic_version..."
pipenv run python - <<'EOF'
import os
import psycopg2

url = os.environ["DATABASE_URL"]
conn = psycopg2.connect(url)
conn.autocommit = True
cur = conn.cursor()

# Drop alembic_version table if it exists
cur.execute("DROP TABLE IF EXISTS alembic_version CASCADE;")

# Drop all tables
cur.execute("""
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
END $$;
""")

cur.close()
conn.close()
EOF

echo "Old database objects removed ✅"

# Remove migrations folder
echo "Removing old migrations..."
rm -rf migrations || true

# Reinitialize Alembic migrations
echo "Reinitializing migrations..."

export FLASK_APP=src/app.py
export DATABASE_URL="$DATABASE_URL"

echo "Database init"
pipenv run flask db init || true
echo "DAtabase migrate"
pipenv run flask db migrate -m "initial" || true
echo "Database upgrade"
pipenv run flask db upgrade || true

echo "Database reset complete ✅"
