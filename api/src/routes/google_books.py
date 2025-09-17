from flask import (
    request,
    jsonify,
)  # Trae el objeto 'request' (para leer query params, headers, etc.) y 'jsonify' (para devolver JSON bien formateado en Flask).
import requests  # Cliente HTTP para hacer la llamada saliente a Google.
import os  # Para leer variables de entorno (aquí, la API key).
from flask_jwt_extended import (
    jwt_required,
)  # Extensión de Flask para JWT: control de acceso por token.

GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1"


def google_books_routes(
    app,
):  # Función que registra rutas en una app Flask que te pasan por parámetro.
    @jwt_required()  # Decorador que exige un JWT válido para acceder a la ruta.
    @app.route(
        "/gbooks/<path:path>", methods=["GET"]
    )  # Define la ruta. '<path:path>' captura subrutas con barras.
    def proxy_gbooks(path):  # Handler que actuará de proxy hacia Google Books.
        url = f"{GOOGLE_BOOKS_URL}{path}"  # Construye la URL destino concatenando base + path capturado.

        params = dict(
            request.args
        )  # Copia los query params que envió el cliente (?q=...&maxResults=...).
        api_key = os.getenv(
            "GOOGLE_API_KEY"
        )  # Lee la API key desde variable de entorno.
        params["key"] = api_key  # Inyecta la API key en los parámetros

        try:
            proxy_request = requests.get(
                url, params=params, timeout=10
            )  # Hace la petición GET a Google Books con los mismos params del cliente + key, con límite de 10s para no colgar el servidor esperando a Google.
            return (
                jsonify(proxy_request.json()),
                proxy_request.status_code,
            )  # Devuelve al cliente el JSON que respondió Google y reusa el status code.
        except requests.RequestException:
            return (
                jsonify({"error": "Failed to fetch from Google Books"}),
                502,
            )  # Si hubo un error de red/timeout/etc., devuelve un 502 (Bad Gateway).
