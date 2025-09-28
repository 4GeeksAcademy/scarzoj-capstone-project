from flask import request, jsonify, Blueprint
from src.models.places_dani import Places
from src.db import db
from flask_jwt_extended import jwt_required

places_bp = Blueprint("places", __name__)


@places_bp.route("/places", methods=["POST"])
@jwt_required()  # solo usuarios logueados
def create_place():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid or missing JSON"}), 400

    required_fields = ["name", "type", "lat", "lng"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    existing = Places.query.filter_by(
        name=data["name"], lat=data["lat"], lng=data["lng"]
    ).first()
    if existing:
        return jsonify({"error": "Place already exists"}), 409

    new_place = Places(
        name=data["name"],
        type=data["type"],
        lat=data["lat"],
        lng=data["lng"],
        address=data.get("address"),
        city=data.get("city"),
        country=data.get("country"),
    )

    db.session.add(new_place)
    db.session.commit()

    return jsonify(
        {"message": "Place created successfully", "place": new_place.serialize()}
    ), 201


@places_bp.route("/places/<int:place_id>", methods=["GET"])
def get_place(place_id):
    place = Places.query.get(place_id)
    if not place:
        return jsonify({"error": "Place not found"}), 404
    return jsonify(place.serialize()), 200


# esta ruta es para listar todos los placessss
@places_bp.route("/places", methods=["GET"])
def list_places():
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 10, type=int)

    pagination = Places.query.paginate(page=page, per_page=limit, error_out=False)
    places = [p.serialize() for p in pagination.items]

    return jsonify(
        {
            "places": places,
            "page": pagination.page,
            "pages": pagination.pages,
            "total": pagination.total,
        }
    ), 200


@places_bp.route("/places/<int:place_id>", methods=["PUT"])
@jwt_required()
def update_place(place_id):
    place = Places.query.get(place_id)
    if not place:
        return jsonify({"error": "Place not found"}), 404

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid or missing JSON"}), 400

    if "name" in data and "lat" in data and "lng" in data:
        existing = Places.query.filter_by(
            name=data["name"], lat=data["lat"], lng=data["lng"]
        ).first()
    if existing and existing.id != place.id:
        return jsonify({"error": "Place already exists"}), 409

    for field in ["name", "type", "lat", "lng", "address", "city", "country"]:
        if field in data:
            setattr(place, field, data[field])

    db.session.commit()
    return jsonify(
        {"message": "Place updated successfully", "place": place.serialize()}
    ), 200


@places_bp.route("/places/<int:place_id>", methods=["DELETE"])
@jwt_required()
def delete_place(place_id):
    place = Places.query.get(place_id)
    if not place:
        return jsonify({"error": "Place not found"}), 404

    db.session.delete(place)
    db.session.commit()
    return jsonify({"message": "Place deleted successfully"}), 200
