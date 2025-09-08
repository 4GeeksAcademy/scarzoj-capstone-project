from flask import request, jsonify
import requests

OPEN_LIBRARY_URL = "https://openlibrary.org/"


def open_library_routes(app):
    @app.route("/olbooks/<path:path>", methods=["GET"])
    def proxi_ol(path):
        url = f"{OPEN_LIBRARY_URL}{path}"
        params = dict(request.args)

        try:
            proxy_request = requests.get(url, params=params, timeout=10)
            return jsonify(proxy_request.json()), proxy_request.status_code
        except requests.RequestException:
            return jsonify({"error": "Failed to fetch from Open Library"}), 502
