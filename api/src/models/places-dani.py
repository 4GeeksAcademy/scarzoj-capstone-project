from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from src.db import db


class Places(db.Model):
    __tablename__ = "places"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    place_id: Mapped[str] = mapped_column(String(100), nullable=False)
    place_type: Mapped[str] = mapped_column(String(20), nullable=False)
    lat: Mapped[float] = mapped_column(float, nullable=False)
    lng: Mapped[float] = mapped_column(float, nullable=False)

    def __repr__(self):
        return f"<Place {self.place_name}>"

    def serialize(self):
        return {
            "id": self.id,
            "place_id": self.place_id,
            "place_type": self.place_type,
            "lat": self.lat,
            "lng": self.lng,
        }
