from flask import (
    request,
    jsonify,
)
import requests
import os
from flask_jwt_extended import jwt_required
from src.repository.book_repository import volume_to_book_fields

GOOGLE_BOOKS_URL = "https://www.googleapis.com/books/v1"


def search_book(
    app,
):  # Función que registra rutas en una app Flask que te pasan por parámetro.
    @app.route(
        "/gbooks/search", methods=["GET"]
    )  # Define la ruta. '<path:path>' captura subrutas con barras.
    @jwt_required()  # Decorador que exige un JWT válido para acceder a la ruta.
    def proxy_gbooks():  # Handler que actuará de proxy hacia Google Books.
        url = f"{GOOGLE_BOOKS_URL}/volumes/"  # Construye la URL destino concatenando base + path capturado.

        params = dict(
            request.args + "&langRestrict=es,en&printType=books"
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

        except Exception as e:
            print(f"Found General Exception in search_book {e}")

        except requests.RequestException as e:
            return (
                jsonify({"error": f"Failed to fetch from Google Books{e}"}),
                502,
            )  # Si hubo un error de red/timeout/etc., devuelve un 502 (Bad Gateway).
