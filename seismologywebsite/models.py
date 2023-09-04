from . import db
from flask_login import UserMixin
import datetime

class Users(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.Text, unique=True, nullable=False)
    fullname = db.Column(db.Text, unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    last_login = db.Column(db.TIMESTAMP, nullable=False, default=datetime.datetime.utcnow)
    registered_date = db.Column(db.DATE, default=datetime.datetime.utcnow().date)

class Topics(db.Model):
    __tablename__ = 'topics'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_name = db.Column(db.Text, nullable=False)
    type = db.Column(db.Text, nullable=False)
    template_name = db.Column(db.Text, nullable=False)




