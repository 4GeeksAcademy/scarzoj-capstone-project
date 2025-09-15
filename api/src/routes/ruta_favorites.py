from flask import Blueprint, request, jsonify
from models import db, Favorite, User, Place

favorites_bp = Blueprint("favorites", __name__)


@favorites_bp.route("/favorites", methods=["GET"])
def get_favorites():
    favorites = Favorite.query.all()
    result = [
        {"id": fav.id, "user_id": fav.user_id, "place_id": fav.place_id}
        for fav in favorites
    ]
    return jsonify(result), 200


@favorites_bp.route("/favorites", methods=["POST"])
def create_favorite():
    data = request.get_json()

    user_id = data.get("user_id")
    place_id = data.get("place_id")

    user = User.query.get(user_id)
    place = Place.query.get(place_id)

    if not user:
        return jsonify({"error": "User not found"}), 404
    if not place:
        return jsonify({"error": "Place not found"}), 404

    new_fav = Favorite(user_id=user_id, place_id=place_id)
    db.session.add(new_fav)
    db.session.commit()

    return jsonify({"msg": "Favorite created", "id": new_fav.id}), 201


@favorites_bp.route("/favorites/<int:id>", methods=["DELETE"])
def delete_favorite(id):
    fav = Favorite.query.get(id)
    if not fav:
        return jsonify({"error": "Favorite not found"}), 404

    db.session.delete(fav)
    db.session.commit()

    return jsonify({"msg": "Favorite deleted"}), 200
