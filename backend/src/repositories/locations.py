from src.orm import models


class LocationsRepository:
    def __init__(self, session_factory) -> None:
        self.session_factory = session_factory

    def get(self, location_id):
      with self.session_factory() as session:
        return session.query(models.Location)\
                .filter(models.Location.id == location_id)\
                .first()

    def get_all(self):
      with self.session_factory() as session:
        return session.query(models.Location).all()

    def create(self, location: models.Location):
      with self.session_factory() as session:
         session.add(location)
         session.commit()

    def delete(self, location_id: str):
      with self.session_factory() as session:
         location = session.query(models.Location).filter(models.Location.id == location_id).first()

         if(location is None):
            return
         
         session.delete(location)
         session.commit()

    def update(self, location: models.Location):
      with self.session_factory() as session:
        model = session.query(models.Location)\
                .filter(models.Location.id == location.id)\
                .first()
        
        for key in model.__dict__.keys():
          setattr(model, key, location[key])
        
        session.commit()
        
    