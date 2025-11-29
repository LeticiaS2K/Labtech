from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from database import db
from models.chave import Chave
from models.entrega import Entrega
from datetime import datetime

chaves_bp = Blueprint("chaves", __name__, template_folder="../templates")

def login_required(view):
    from functools import wraps
    @wraps(view)
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("auth.login"))
        return view(*args, **kwargs)
    return wrapped

@chaves_bp.route("/entrega", methods=["GET", "POST"])
@login_required
def entrega():
    if request.method == "POST":
        identificacao = request.form.get("id_chave")
        professor = request.form.get("professor")
        administrador = request.form.get("administrador")
        data_retirada = request.form.get("data_retirada")
        finalidade = request.form.get("finalidade")

        chave = Chave.query.filter_by(identificacao=identificacao).first()
        if not chave:
            flash("Chave não encontrada", "error")
            return redirect(url_for("chaves.entrega"))

        entregue = Entrega(
            chave_id=chave.id,
            usuario=professor,
            administrador=administrador,
            data_retirada=datetime.fromisoformat(data_retirada),
            finalidade=finalidade,
            status="Pendente"
        )
        chave.disponivel = False
        db.session.add(entregue)
        db.session.commit()
        flash("Entrega registrada", "success")
        return redirect(url_for("dashboard.index"))

    chaves = Chave.query.filter_by(disponivel=True).all()
    return render_template("entrega_chaves.html", chaves=chaves)

@chaves_bp.route("/devolucao/<int:entrega_id>", methods=["GET", "POST"])
@login_required
def devolucao(entrega_id):
    entrega = Entrega.query.get_or_404(entrega_id)

    if request.method == "POST":
        data_devolucao = request.form.get("data_devolucao")
        entrega.data_devolucao = datetime.fromisoformat(data_devolucao)
        entrega.status = "Devolvido"
        entrega.chave.disponivel = True
        db.session.commit()
        flash("Devolução registrada", "success")
        return redirect(url_for("dashboard.index"))

    return render_template("devolucao_chaves.html", entrega=entrega)
