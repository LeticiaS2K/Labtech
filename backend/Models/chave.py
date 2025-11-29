from database import db

class Chave(db.Model):
    __tablename__ = "chaves"
    id = db.Column(db.Integer, primary_key=True)
    identificacao = db.Column(db.String(50), unique=True, nullable=False)  # ex: LAB-06
    descricao = db.Column(db.String(200), nullable=True)
    disponivel = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f"<Chave {self.identificacao}>"
