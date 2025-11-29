# backend/config.py
import os

# pasta base do backend (onde está app.py, Models, routes, etc.)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# pasta instance: backend/instance
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")

# garante que a pasta existe
os.makedirs(INSTANCE_DIR, exist_ok=True)

class Config:
    SECRET_KEY = "muda-essa-string-depois"  # precisa ter alguma coisa aqui
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(INSTANCE_DIR, "labtech.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
