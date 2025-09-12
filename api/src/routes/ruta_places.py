from flask import request, jsonify
from src.models.place import Places
from src.db import db
from flask_jwt_extended import jwt_required


def places_routes(app):
    @app.route("/places", methods=["POST"])
    @jwt_required()  # solo usuarios logueados
    def create_place():
        data = request.get_json()
        required_fields = ["name", "type", "lat", "lng"]

        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

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

    @app.route("/places/<int:place_id>", methods=["GET"])
    def get_place(place_id):
        place = Places.query.get(place_id)
        if not place:
            return jsonify({"error": "Place not found"}), 404
        return jsonify(place.serialize()), 200

    # Listar todos los lugares
    @app.route("/places", methods=["GET"])
    def list_places():
        places = Places.query.all()
        return jsonify([place.serialize() for place in places]), 200

    @app.route("/places/<int:place_id>", methods=["PUT"])
    @jwt_required()
    def update_place(place_id):
        place = Places.query.get(place_id)
        if not place:
            return jsonify({"error": "Place not found"}), 404

        data = request.get_json()
        for field in ["name", "type", "lat", "lng", "address", "city", "country"]:
            if field in data:
                setattr(place, field, data[field])

        db.session.commit()
        return jsonify(
            {"message": "Place updated successfully", "place": place.serialize()}
        ), 200

    @app.route("/places/<int:place_id>", methods=["DELETE"])
    @jwt_required()
    def delete_place(place_id):
        place = Places.query.get(place_id)
        if not place:
            return jsonify({"error": "Place not found"}), 404

        db.session.delete(place)
        db.session.commit()
        return jsonify({"message": "Place deleted successfully"}), 200
