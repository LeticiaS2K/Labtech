# backend/Models/entrega.py
from database import db
from datetime import datetime

class Entrega(db.Model):
    __tablename__ = "entregas"

    id = db.Column(db.Integer, primary_key=True)

    chave_id = db.Column(db.Integer, db.ForeignKey("chaves.id"), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"), nullable=True)

    responsavel = db.Column(db.String(120), nullable=False)
    contato = db.Column(db.String(120), nullable=True)
    destino = db.Column(db.String(120), nullable=True)
    observacao = db.Column(db.Text, nullable=True)

    data_hora_entrega = db.Column(db.DateTime, default=datetime.utcnow)
    devolvida = db.Column(db.Boolean, default=False)
    data_hora_devolucao = db.Column(db.DateTime, nullable=True)

    chave = db.relationship("Chave", backref="entregas")

    def __repr__(self):
        return f"<Entrega chave={self.chave_id} responsavel={self.responsavel}>"
