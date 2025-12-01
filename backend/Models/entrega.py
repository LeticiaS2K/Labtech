from database import db
from datetime import datetime

class Entrega(db.Model):
    __tablename__ = "entregas"

    id = db.Column(db.Integer, primary_key=True)
    chave_id = db.Column(db.Integer, db.ForeignKey("chaves.id"), nullable=False)
    usuario_id = db.Column(db.Integer, nullable=False)

    responsavel = db.Column(db.String(120), nullable=False)
    contato = db.Column(db.String(120), nullable=True)
    destino = db.Column(db.String(120), nullable=True)
    observacao = db.Column(db.Text, nullable=True)

    data_hora_entrega = db.Column(db.DateTime, default=datetime.utcnow)
    data_hora_devolucao = db.Column(db.DateTime, nullable=True)

    devolvida = db.Column(db.Boolean, default=False)

    # 👇 CAMPO NOVO
    status = db.Column(db.String(20), nullable=False, default="Pendente")

    chave = db.relationship("Chave", backref="entregas")
