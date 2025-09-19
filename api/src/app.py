import os
import time
from src.routes.open_library import open_library_routes
from src.utils import generate_sitemap
from src.routes.auth import auth_routes
from src.routes.google_books import google_books_routes
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_migrate import Migrate
from src.db import db
from flask_cors import CORS
from src.routes.ruta_places import places_bp
from flask_jwt_extended import (
    JWTManager,
)

load_dotenv()

start_time = time.time()
app = Flask(__name__)

db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

jwt_key = os.getenv("JWT_SECRET_KEY")

# JWT
app.config["JWT_SECRET_KEY"] = jwt_key
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_CSRF_PROTECT"] = True
app.config["JWT_CSRF_IN_COOKIES"] = True
app.config["JWT_COOKIE_SECURE"] = True

jwt = JWTManager(app)

MIGRATE = Migrate(app, db)
db.init_app(app)
app.config["CORS_HEADERS"] = "Content-Type"
CORS(app, supports_credentials=True)

app.register_blueprint(places_bp)

auth_routes(app)
google_books_routes(app)
open_library_routes(app)


@app.route("/")
def sitemap():
    return generate_sitemap(app)


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "uptime": round(time.time() - start_time, 2)}), 200


if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=PORT, debug=False)
