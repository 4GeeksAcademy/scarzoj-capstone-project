from __future__ import annotations
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
        total=2,
        backoff_factor=0.3,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods={"GET"},
        raise_on_status=False,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    session.headers.update({"User-Agent": "gbooks-client/1.0"})
    return session


SESSION = build_session()


def require_api_key() -> Optional[str]:
    return os.getenv("GOOGLE_API_KEY")


def clamp_int(value: int | str, *, lo: int, hi: int, default: int) -> int:
    try:
        ivalue = int(value)
    except (TypeError, ValueError):
        ivalue = default
    return max(lo, min(ivalue, hi))


def compose_url(path: str) -> str:
    base = BASE_URL.rstrip("/")
    clean = path.lstrip("/")
    return f"{base}/{clean}"


def gbooks_get(
    path: str,
    params: Optional[Dict[str, Any]] = None,
    *,
    etag: Optional[str] = None,
    timeout: int = DEFAULT_TIMEOUT,
) -> requests.Response:
    url = compose_url(path)
    query: Dict[str, Any] = dict(params or {})

    api_key = require_api_key()
    if api_key:
        query["key"] = api_key

    req_headers: Dict[str, str] = {}
    if etag:
        req_headers["If-None-Match"] = etag

    resp = SESSION.get(url, params=query, headers=req_headers, timeout=timeout)
    return resp


def get_volume(
    volume_id: str,
    *,
    projection: Optional[str] = None,
    etag: Optional[str] = None,
    timeout: int = DEFAULT_TIMEOUT,
) -> Dict[str, Any]:
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


def search_volumes(
    q: str,
    *,
    start_index: int | str = 0,
    max_results: int | str = 10,
    order_by: Optional[str] = None,
    lang_restrict: Optional[str] = None,
    print_type: Optional[str] = None,
    filter_by: Optional[str] = None,
    projection: Optional[str] = None,
    etag: Optional[str] = None,
    timeout: int = DEFAULT_TIMEOUT,
) -> Dict[str, Any]:
    params: Dict[str, Any] = {
        "q": q,
        "startIndex": max(0, clamp_int(start_index, lo=0, hi=10**9, default=0)),
        "maxResults": clamp_int(max_results, lo=1, hi=40, default=10),
    }
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

    resp = gbooks_get("volumes", params=params, etag=etag, timeout=timeout)
    if resp.status_code == 304:
        return {}
    try:
        return resp.json() if resp.content else {}
    except ValueError:
        return {}
