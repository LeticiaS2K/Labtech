# backend/routes/dashboard.py
from flask import Blueprint, render_template, session, redirect, url_for, jsonify, request
from database import db
from Models.chave import Chave
from Models.entrega import Entrega

dashboard_bp = Blueprint("dashboard", __name__, template_folder="../templates")


def login_required(view):
    from functools import wraps

    @wraps(view)
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("auth.login"))
        return view(*args, **kwargs)

    return wrapped


# ===== ROTA HTML ANTIGA (se um dia quiser usar templates) =====
@dashboard_bp.route("/")
@login_required
def index():
    total_chaves = Chave.query.count()
    chaves_disponiveis = Chave.query.filter_by(disponivel=True).count()

    # AQUI JÁ USAMOS DEVOLVIDA EM VEZ DE STATUS
    entregas_pendentes = Entrega.query.filter_by(devolvida=False).count()
    devolvidas = Entrega.query.filter_by(devolvida=True).count()

    stats = {
        "total_chaves": total_chaves,
        "disponiveis": chaves_disponiveis,
        "pendentes": entregas_pendentes,
        "devolvidas": devolvidas,
    }

    return render_template(
        "dashboard.html", stats=stats, user_name=session.get("user_name")
    )


# ===== API PARA O REACT: GET /api/dashboard =====
@dashboard_bp.route("/api/dashboard", methods=["GET", "OPTIONS"])
def api_dashboard():
    # Resposta pro preflight CORS
    if request.method == "OPTIONS":
        return ("", 200)

    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autenticado."}), 401

    try:
        total_chaves = Chave.query.count()
        chaves_disponiveis = Chave.query.filter_by(disponivel=True).count()

        # ⚠️ PRINCIPAL MUDANÇA: aqui usamos devolvida em vez de status
        entregas_pendentes = Entrega.query.filter_by(devolvida=False).count()
        devolvidas = Entrega.query.filter_by(devolvida=True).count()

        # última entrega (pela data/hora)
        ultima = (
            Entrega.query.order_by(Entrega.data_hora_entrega.desc()).first()
        )

        last_delivery = None
        if ultima:
            last_delivery = {
                # se o campo status existir, beleza; se não, caímos em "Pendente"/"Devolvido"
                "status": getattr(
                    ultima,
                    "status",
                    "Devolvido" if ultima.devolvida else "Pendente",
                ),
                "responsavel": ultima.responsavel,
                "sala": ultima.destino,
                "created_at": ultima.data_hora_entrega.isoformat()
                if ultima.data_hora_entrega
                else None,
            }

        return (
            jsonify(
                {
                    "success": True,
                    "stats": {
                        "total_chaves": total_chaves,
                        "disponiveis": chaves_disponiveis,
                        "pendentes": entregas_pendentes,
                        "devolvidas": devolvidas,
                    },
                    "last_delivery": last_delivery,
                }
            ),
            200,
        )

    except Exception as e:
        # loga no terminal pra você ver o erro real
        print("ERRO em /api/dashboard:", e)
        return (
            jsonify(
                {"success": False, "message": "Erro interno ao carregar dashboard."}
            ),
            500,
        )
