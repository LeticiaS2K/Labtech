from flask import Blueprint, render_template, session, redirect, url_for
from database import db
from models.chave import Chave
from models.entrega import Entrega

dashboard_bp = Blueprint("dashboard", __name__, template_folder="../templates")

def login_required(view):
    from functools import wraps
    @wraps(view)
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("auth.login"))
        return view(*args, **kwargs)
    return wrapped

@dashboard_bp.route("/")
@login_required
def index():
    total_chaves = Chave.query.count()
    chaves_disponiveis = Chave.query.filter_by(disponivel=True).count()
    entregas_pendentes = Entrega.query.filter_by(status="Pendente").count()
    devolvidas = Entrega.query.filter_by(status="Devolvido").count()

    stats = {
        "total_chaves": total_chaves,
        "disponiveis": chaves_disponiveis,
        "pendentes": entregas_pendentes,
        "devolvidas": devolvidas
    }

    return render_template("dashboard.html", stats=stats, user_name=session.get("user_name"))
