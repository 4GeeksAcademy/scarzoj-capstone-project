from flask import request, jsonify
import requests
import os
from flask_jwt_extended import (
    jwt_required,
)

GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1/"


def google_books_routes(app):
    @jwt_required()
    @app.route("/gbooks/<path:path>", methods=["GET"])
    def proxy_gbooks(path):
        url = f"{GOOGLE_BOOKS_URL}{path}"

        params = dict(request.args)
        api_key = os.getenv("GOOGLE_API_KEY")
        params["key"] = api_key

        try:
            proxy_request = requests.get(url, params=params, timeout=10)
            return jsonify(proxy_request.json()), proxy_request.status_code
        except requests.RequestException:
            return jsonify({"error": "Failed to fetch from Google Books"}), 502
