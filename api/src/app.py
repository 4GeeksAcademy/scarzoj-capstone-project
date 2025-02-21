import os
import time

from flask import Flask, jsonify
from flask_migrate import Migrate, init
from models import Users, db

app = Flask(__name__)
start_time = time.time()

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

MIGRATE = Migrate(app, db)
db.init_app(app)

@app.route("/health", methods=["GET"])
def health_check():
    users = Users.query.all()
    print(users)
    return jsonify({"status": "ok", "uptime": round(time.time() - start_time, 2)}), 200


if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=PORT, debug=False)
