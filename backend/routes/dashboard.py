# backend/routes/dashboard.py
from flask import Blueprint, jsonify, session, current_app
from database import db
from Models.chave import Chave
from Models.entrega import Entrega

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api")


@dashboard_bp.route("/dashboard", methods=["GET"])
def dashboard_api():
    try:
        # --- ESTATÍSTICAS DE CHAVES ---
        total_chaves = Chave.query.count()
        chaves_disponiveis = Chave.query.filter_by(disponivel=True).count()

        # --- ESTATÍSTICAS DE ENTREGAS ---
        total_entregas = Entrega.query.count()
        entregas_pendentes = Entrega.query.filter_by(devolvida=False).count()
        entregas_devolvidas = Entrega.query.filter_by(devolvida=True).count()

        # --- STATUS GERAL ---
        if total_entregas == 0:
            # nunca teve entrega registrada
            status_geral = "Sem registros"
        elif entregas_pendentes > 0:
            # pelo menos uma chave não devolvida
            status_geral = "Pendente"
        else:
            # já teve entrega, mas todas devolvidas
            status_geral = "Devolvido"

        # --- ÚLTIMA MOVIMENTAÇÃO (entrega ou devolução) ---
        ultima = (
            Entrega.query.order_by(Entrega.data_hora_entrega.desc()).first()
        )

        if ultima:
            ultima_json = {
                "id": ultima.id,
                "chave": ultima.chave.identificacao if ultima.chave else None,
                "destino": ultima.destino,
                "responsavel": ultima.responsavel,
                "tipo": "Pendente" if not ultima.devolvida else "Devolvido",
                "data_entrega": (
                    ultima.data_hora_entrega.isoformat()
                    if ultima.data_hora_entrega
                    else None
                ),
                "data_devolucao": (
                    ultima.data_hora_devolucao.isoformat()
                    if ultima.data_hora_devolucao
                    else None
                ),
                "observacao": ultima.observacao,
            }
        else:
            ultima_json = None

        return jsonify(
            {
                "success": True,
                "stats": {
                    "total_chaves": total_chaves,
                    "disponiveis": chaves_disponiveis,
                    "total_entregas": total_entregas,
                    "pendentes": entregas_pendentes,
                    "devolvidas": entregas_devolvidas,
                },
                "status_geral": status_geral,
                "ultima_mov": ultima_json,
            }
        ), 200

    except Exception as e:
        current_app.logger.exception("Erro em /api/dashboard")
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Erro interno ao carregar dashboard.",
                }
            ),
            500,
        )
