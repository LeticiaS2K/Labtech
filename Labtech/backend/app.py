from flask import Flask
from config import Config
from database import db
import os

def create_app():
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.config.from_object(Config)

    instance_dir = os.path.join(os.path.dirname(__file__), "instance")
    os.makedirs(instance_dir, exist_ok=True)

    db.init_app(app)

    from routes.auth import auth_bp
    from routes.dashboard import dashboard_bp
    from routes.chaves import chaves_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(chaves_bp)

    with app.app_context():
        from models import usuario, chave, entrega 
        db.create_all()
        seed(app)

    return app

def seed(app):
    from models.usuario import Usuario
    from models.chave import Chave
    from database import db

    if not Usuario.query.filter_by(email="admin@udf.local").first():
        admin = Usuario(nome="Admin UDF", email="admin@udf.local")
        admin.set_senha("senha123")  
        db.session.add(admin)

    if Chave.query.count() == 0:
        exemplos = [
            Chave(identificacao="LAB-01", descricao="Laboratório 1"),
            Chave(identificacao="LAB-02", descricao="Laboratório 2"),
            Chave(identificacao="LAB-06", descricao="Laboratório 6"),
        ]
        db.session.bulk_save_objects(exemplos)

    db.session.commit()

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
