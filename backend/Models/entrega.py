from database import db
from datetime import datetime

class Entrega(db.Model):
    __tablename__ = "entregas"
    id = db.Column(db.Integer, primary_key=True)
    chave_id = db.Column(db.Integer, db.ForeignKey('chaves.id'), nullable=False)
    usuario = db.Column(db.String(120), nullable=False)     
    administrador = db.Column(db.String(120), nullable=True)
    data_retirada = db.Column(db.DateTime, nullable=False)
    data_prev_devolucao = db.Column(db.DateTime, nullable=True)
    data_devolucao = db.Column(db.DateTime, nullable=True)
    finalidade = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(30), nullable=False, default="Pendente")  

    chave = db.relationship("Chave", backref="entregas")

    def __repr__(self):
        return f"<Entrega {self.id} chave {self.chave_id} status {self.status}>"
