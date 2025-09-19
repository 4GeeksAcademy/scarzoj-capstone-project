from sqlalchemy import ForeignKey, DateTime, func  # String VARCHAR
from sqlalchemy.orm import Mapped, mapped_column, relationship
from src.db import db


class Favorites(db.Model):
    __tablename__ = "favorites"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    place_id: Mapped[int] = mapped_column(ForeignKey("places.id"), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())

    # Relaciones
    user = relationship("Users", backref="favorites")
    place = relationship("Places", backref="favorites")

    def __repr__(self):
        return f"<Favorite User={self.user_id} Place={self.place_id}>"

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "place_id": self.place_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
