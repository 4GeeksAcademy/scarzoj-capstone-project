from flask import request, jsonify, abort
from sqlalchemy import select
from src.models.models import db, Users, Profile
from flask_jwt_extended import jwt_required, get_jwt_identity


def register_profile_endpoints(app):
    @app.route("/profile", methods=["GET"])
    @jwt_required()
    def get_profile():
        user_id = get_jwt_identity()
        profile = Profile.query.get(user_id)

        return jsonify(profile.serialize()), 200

    @app.route("/profilepost", methods=["POST"])
    @jwt_required()
    def edit_profile():
        user_id = get_jwt_identity()
        profile = Profile.query.get(user_id)
        data = request.get_json()
        profile.display_name = data["display_name"]
        profile.description = data["description"]
        profile.avatar = data["avatar"]

        db.session.commit()

        return jsonify(profile.serialize()), 200
