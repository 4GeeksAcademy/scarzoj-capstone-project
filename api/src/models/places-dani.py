from sqlalchemy import String, VARCHAR
from sqlalchemy.orm import Mapped, mapped_column
from src.db import db


class Places(db.Model):
    __tablename__ = "places"

    place_id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    place_name: Mapped[str] = mapped_column(String(100), nullable=False)
    place_type: Mapped[str] = mapped_column(String(20), nullable=False)
    lat: Mapped[float] = mapped_column(float, nullable=False)
    lng: Mapped[float] = mapped_column(float, nullable=False)

    def __repr__(self):
        return f"<Place {self.place_name}>"

    def serialize(self):
        return {
            "place_id": self.id,
            "place_name": self.user_name,
            "place_type": self.place_type,
            "lat": self.lat,
            "lng": self.lng,
        }
