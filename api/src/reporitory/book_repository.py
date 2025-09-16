from typing import Dict, Any, List, Optional
from sqlalchemy import select, delete
from api.src.models.models import db, Book, UserBookStatus, BookStatusEnum


# MAPEAMOS los campos que nos interesan para insertar/actualizar en 'books'. Retorna un dict listo para pasarlo al repositorio.
def volume_to_book_fields(v: Dict[str, Any]) -> Dict[str, Any]:
    info = v.get("volumeInfo", {}) or {}
    links = info.get("imageLinks", {}) or {}

    return {
        "id": v.get("id"),  # PK local (google_volume_id)
        "title": info.get("title"),  # Título principal
        "authors_json": info.get("authors") or [],  # Lista de autores
        "thumbnail": links.get("thumbnail"),  # Miniatura si existe
        "info_link": info.get("infoLink") or v.get("selfLink"),  # Enlace informativo
    }


def upsert_book(book_fields: Dict[str, Any]) -> Book:
    # Crear o actualizar un libro por su ID (google_volume_id) y devuelve la instancia persistida.

    book_id = book_fields["id"]  # este viene del mapper
    book = db.session.get(Book, book_id)  # busca por PK
    if not book:
        book = Book(id=book_id)  # crea la entidad si no existe.
        db.session.add(book)

    # Asignación de campos básicos (no seteamos "id" de nuevo)
    book.title = book_fields.get("title")
    book.authors_json = book_fields.get("authors_json") or []
    book.thumbnail = book_fields.get("thumbnail")
    book.info_link = book_fields.get("info_link")

    db.session.commit()
    return book


def set_user_book_status(
    user_id: int,
    book_id: str,
    status: BookStatusEnum,
    # note: Optional[str] = None,
    # rating: Optional[int] = None,
) -> UserBookStatus:
    link = db.session.get(
        UserBookStatus,
        {"user_id": user_id, "book_id": book_id, "status": status},
    )
    if not link:
        link = UserBookStatus(user_id=user_id, book_id=book_id, status=status)
    db.session.add(link)

    # link.note = (note or None)
    # link.rating = (int(rating) if rating is not None else None)

    db.session.commit()
    return link


def unset_user_book_status(
    user_id: int,
    book_id: str,
    status: BookStatusEnum,
) -> int:
    stmt = delete(UserBookStatus).where(
        UserBookStatus.user_id == user_id,
        UserBookStatus.book_id == book_id,
        UserBookStatus.status == status,
    )
    res = db.session.execute(stmt)
    db.session.commit()
    return res.rowcount


def list_user_books(
    user_id: int, status: Optional[BookStatusEnum] = None
) -> List[
    Dict[str, Any]
]:  # Lista de libros asociados a un usuario, filtrando por status
    q = (
        db.session.query(UserBookStatus, Book)
        .join(Book, Book.id == UserBookStatus.book_id)
        .filter(UserBookStatus.user_id == user_id)
    )

    if status:
        q = q.filter(UserBookStatus.status == status)

    rows = []
    for link, book in q.all():
        rows.append(
            {
                "book_id": book.id,
                "title": book.title,
                "authors": book.authors_json or [],
                "thumbnail": book.thumbnail,
                "info_link": book.info_link,
                "status": link.status.value,
                "note": link.note,
                "rating": link.rating,
            }
        )

    return rows
