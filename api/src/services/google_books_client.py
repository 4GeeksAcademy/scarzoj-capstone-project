from __future__ import annotations  # Permite usar anotaciones de tipos "modernas"

import os
from typing import Any, Dict, Optional

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

BASE_URL: str = os.getenv("GOOGLE_BOOKS_URL", "https://www.googleapis.com/books/v1")

DEFAULT_TIMEOUT: int = 10


def build_session() -> requests.Session:
    session = requests.Session()

    retry = Retry(
        total=2,  # Nº de reintentos *además* del intento inicial
        backoff_factor=0.3,  # 0.3s, 0.6s, 1.2s entre reintentos
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods={"GET"},
        raise_on_status=False,  # No lances excepción solo por status != 2xx
    )

    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)

    session.headers.update({"User-Agent": "gbooks-client/1.0"})
    return session


# UTILIDADES INTERNAS:


def require_api_key() -> str:
    # Lee la API key de entorno. Si no existe, falla *rápido* (porque es un error de config).

    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise RuntimeError("Missing GOOGLE_API_KEY environment variable")
    return api_key


def clamp_int(value: int | str, *, lo: int, hi: int, default: int) -> int:
    # Convierte a int y acota en el rango [lo, hi]. Útil para parámetros como `maxResults` (Google permite 1..40).
    try:
        ivalue = int(value)
    except (TypeError, ValueError):
        ivalue = default
    return max(lo, min(ivalue, hi))


def compose_url(path: str) -> str:
    # Ensambla la URL final evitando dobles barras.

    base = BASE_URL.rstrip("/")
    clean = path.lstrip("/")
    return f"{base}/{clean}"


# GET GENÉRICOS


def gbooks_get(
    path: str,
    params: Optional[Dict[str, Any]] = None,
    *,
    etag: Optional[str] = None,  # Si lo pasas, se añade If-None-Match
    timeout: int = DEFAULT_TIMEOUT,
) -> requests.Response:
    api_key = require_api_key()
    url = compose_url(path)
    query: Dict[str, Any] = dict(params or {})
    query["key"] = api_key

    resp = SESSION.get(url, params=query, headers=headers, timeout=timeout)
    return resp


# FUNCIONES PARA ENDPOINTS/SERVICIOS
def search_volumes(
    q: str,
    *,
    start_index: int | str = 0,
    max_results: int | str = 10,
    order_by: Optional[str] = None,  # "relevance" | "newest"
    lang_restrict: Optional[str] = None,  # ISO 639-1 ("es", "en", ...)
    print_type: Optional[str] = None,  # "all" | "books" | "magazines"
    filter_by: Optional[
        str
    ] = None,  # "partial"|"full"|"free-ebooks"|"paid-ebooks"|"ebooks"
    projection: Optional[str] = None,  # "lite" | "full"
    etag: Optional[str] = None,  # para If-None-Match
    timeout: int = DEFAULT_TIMEOUT,
) -> Dict[str, Any]:
    # Busca volúmenes en Google Books y devuelve el JSON como `dict`.

    # Armamos params con límites sanos
    params: Dict[str, Any] = {
        "q": q,
        "startIndex": max(0, clamp_int(start_index, lo=0, hi=10**9, default=0)),
        "maxResults": clamp_int(max_results, lo=1, hi=40, default=10),
    }

    # Parámetros opcionales *solo* si son válidos
    if order_by in {"relevance", "newest"}:
        params["orderBy"] = order_by
    if lang_restrict:
        params["langRestrict"] = lang_restrict
    if print_type in {"all", "books", "magazines"}:
        params["printType"] = print_type
    if filter_by in {"partial", "full", "free-ebooks", "paid-ebooks", "ebooks"}:
        params["filter"] = filter_by
    if projection in {"lite", "full"}:
        params["projection"] = projection

    # petición:
    resp = gbooks_get("volumes", params=params, etag=etag, timeout=timeout)

    if resp.status_code == 304:
        return {}

    # Intentamos parsear JSON  y sino devolvemos {}.
    try:
        return resp.json() if resp.content else {}
    except ValueError:
        return {}


def get_volume(
    volume_id: str,
    *,
    projection: Optional[str] = None,  # "lite" | "full"
    etag: Optional[str] = None,  # para If-None-Match
    timeout: int = DEFAULT_TIMEOUT,
) -> Dict[str, Any]:
    # Recupera un volumen concreto por su ID de Google Books y devuelve el JSON como dict.

    params: Dict[str, Any] = {}
    if projection in {"lite", "full"}:
        params["projection"] = projection

    resp = gbooks_get(f"volumes/{volume_id}", params=params, etag=etag, timeout=timeout)

    if resp.status_code == 304:
        return {}

    try:
        return resp.json() if resp.content else {}
    except ValueError:
        return {}
