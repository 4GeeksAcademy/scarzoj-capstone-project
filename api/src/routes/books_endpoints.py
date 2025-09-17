from flask import request, jsonify, abort
from sqlalchemy import select
from api.src.reporitory.book_repository import (
    volume_to_book_fields,
    upsert_book,
    set_user_book_status,
    unset_user_book_status,
    list_user_books,
)
from api.src.models.models import db, Users, Book, UserBookStatus, BookStatusEnum
from src.services.google_books_client import get_volume


def get_current_user() -> Users:
    uid = request.headers.get("X-User-Id", "1")
    if not uid.isdigit():
        abort(400, description="X-User-Id debe ser numérico")
    user = db.session.get(Users, int(uid))
    if not user:
        abort(400, description=f"Usuario con id={uid} no existe")
    return user


def obj_or_404(model, pk, msg: str):  # carga por PK y aborta con 404 si no existe.
    obj = db.session.get(model, pk)
    if not obj:
        return jsonify({"error": msg}), 404  # Devolvemos json + 404

    return obj


def serialize_link(
    link: UserBookStatus, book: Book
) -> dict:  # serializa la relación user-book-status + datos básicos del libro para pasarlos al front.
    return {
        "user_id": link.user_id,
        "book_id": link.book_id,
        "status": link.status.value,
        "note": link.note,
        "rating": link.rating,
        "title": book.title,
        "authors": book.authors_json or [],
        "thumbnail": book.thumbnail,
        "info_link": book.info_link,
    }


def register_book_endpoints(app):
    @app.route("/books/import/<string:volume_id>", methods=["POST"])
    def import_book(
        volume_id: str,
    ):  # llama a la API para obtener el volumen (ID), lo mapea y hace upsert en la tabla de datos y devuelve el registro local creado/actualizado
        v = get_volume(volume_id)
        if not v or not v.get("id"):
            return jsonify(
                {"error": "No se ha encontrado el libro en Google Books"}
            ), 404

        fields = volume_to_book_fields(v)

        book = upsert_book(fields)

        return jsonify(
            {
                "id": book.id,
                "title": book.title,
                "authors": book.authors_json or [],
                "thumbnail": book.thumbnail,
                "info_link": book.info_link,
            }
        ), 201

    @app.route("/favorite/book/<string:book_id>", methods=["POST"])
    def add_fav_book(
        book_id: str,
    ):  # añadir un libro a favoritos del usuario actual. Si ya está agregado, devuelve 200.
        user = get_current_user()
        if not isinstance(user, Users):
            return user

        book = obj_or_404(Book, book_id, "No se ha encontrado el libro")
        if not isinstance(book, Book):
            return book

        exists = db.session.scalars(
            select(UserBookStatus).filter_by(
                user_id=user.id, book_id=book.id, status=BookStatusEnum.favorite
            )
        ).first()
        if exists:
            return jsonify({"message": "Ya estaba en favoritos"}), 200

        link = UserBookStatus(
            user_id=user.id, book_id=book.id, status=BookStatusEnum.favorite
        )
        db.session.add(link)
        db.session.commit()

        return jsonify(serialize_link(link, book)), 201

    @app.route("/favorite/book/<string:book_id>", methods=["DELETE"])
    def remove_fav_book(
        book_id: str,
    ):  # quitamos un libro de la lista de favoritos actual
        user = get_current_user()
        if not isinstance(user, Users):
            return user

        book = obj_or_404(Book, book_id, "No se ha encontrado el libro")
        if not isinstance(book, Book):
            return book

        link = db.session.scalars(
            select(UserBookStatus).filter_by(
                user_id=user.id, book_id=book.id, status=BookStatusEnum.favorite
            )
        ).first()
        if not link:
            return jsonify({"message": "No estaba en favoritos"}), 200

        db.session.delete(link)
        db.session.commit()
        return jsonify({"message": "Eliminado de favoritos"}), 200

    # TO READ

    @app.route("/to_read/book/<string:book_id>", methods=["POST"])
    def add_to_read_book(book_id: str):
        user = get_current_user()
        if not isinstance(user, Users):
            return user

        book = obj_or_404(Book, book_id, "No se ha encontrado el libro")
        if not isinstance(book, Book):
            return book

        exists = db.session.scalars(
            select(UserBookStatus).filter_by(
                user_id=user.id, book_id=book.id, status=BookStatusEnum.to_read
            )
        ).first()
        if exists:
            return jsonify({"message": "Ya estaba en tu lista de libros por Leer"}), 200

        link = UserBookStatus(
            user_id=user.id, book_id=book.id, status=BookStatusEnum.to_read
        )
        db.session.add(link)
        db.session.commit()
        return jsonify(serialize_link(link, book)), 201

    @app.route("/to_read/book/<string:book_id>", methods=["DELETE"])
    def remove_to_read_book(book_id: str):  # quita el libro de la lista de "para leer"
        user = get_current_user()
        if not isinstance(user, Users):
            return user

        book = obj_or_404(Book, book_id, "No se ha encontrado el libro")
        if not isinstance(book, Book):
            return book

        link = db.session.scalars(
            select(UserBookStatus).filter_by(
                user_id=user.id, book_id=book.id, status=BookStatusEnum.to_read
            )
        ).first()
        if not link:
            return jsonify({"error": "No estaba en 'por leer'"}), 404

        db.session.delete(link)
        db.session.commit()
        return jsonify({"message": "Eliminado de 'por leer'"}), 200

    # READ
    @app.route("/read/book/<string:book_id>", methods=["POST"])
    def add_read_book(book_id: str):  # marcamos el libro como "leído"
        user = get_current_user()
        if not isinstance(user, Users):
            return user

        book = obj_or_404(Book, book_id, "No se ha encontrado el libro")
        if not isinstance(book, Book):
            return book

        exists = db.session.scalars(
            select(UserBookStatus).filter_by(
                user_id=user.id, book_id=book.id, status=BookStatusEnum.read
            )
        ).first()
        if exists:
            return jsonify({"message": "Ya estaba en 'leído'"}), 200

        link = UserBookStatus(
            user_id=user.id, book_id=book.id, status=BookStatusEnum.read
        )

        db.session.add(link)
        db.session.commit()
        return jsonify(serialize_link(link, book)), 201

    @app.route("/read/book/<string:book_id>", methods=["DELETE"])
    def remove_read_book(book_id: str):  # quitamos el estado de "leído" para el libro.
        user = get_current_user()
        if not isinstance(user, Users):
            return user

        book = obj_or_404(Book, book_id, "No se ha encontrado el libro")
        if not isinstance(book, Book):
            return book

        link = db.session.scalars(
            select(UserBookStatus).filter_by(
                user_id=user.id, book_id=book.id, status=BookStatusEnum.read
            )
        ).first()
        if not link:
            return jsonify({"error": "No estaba en 'leído'"}), 404

        db.session.delete(link)
        db.session.commit()
        return jsonify({"message": "Eliminado de 'leído'"}), 200

    # LISTADO DE LIBROS DEL USUARIO FILTRADO POR STATUS
    @app.route("/books/mine", methods=["GET"])
    def list_my_books():
        user = get_current_user()
        if not isinstance(user, Users):
            return user

        status_param = request.args.get("status")
        status_filter = None
        if status_param:
            try:
                status_filter = BookStatusEnum(status_param)
            except ValueError:
                return jsonify({"error": f"Invalid status '{status_param}'"}), 400

        q = (
            db.session.query(UserBookStatus, Book)
            .join(Book, Book.id == UserBookStatus.book_id)
            .filter(UserBookStatus.user_id == user.id)
        )

        if status_filter:
            q = q.filter(UserBookStatus.status == status_filter)

        items = []
        for link, book in q.all():
            items.append(serialize_link(link, book))

        return jsonify(items), 200
