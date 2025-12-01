# backend/routes/chaves.py
from flask import Blueprint, jsonify, request, session
from datetime import datetime

from database import db
from Models.chave import Chave
from Models.entrega import Entrega

# todas as rotas deste blueprint começam com /api
chaves_bp = Blueprint("chaves", __name__, url_prefix="/api")


# =========================================================
# 1) LISTAR CHAVES
#    GET /api/chaves
#    GET /api/chaves?disponivel=true
#    GET /api/chaves?disponivel=false
# =========================================================
@chaves_bp.route("/chaves", methods=["GET"])
def listar_chaves():
    disponivel = request.args.get("disponivel")  # "true" | "false" | None
    query = Chave.query

    if disponivel == "true":
        query = query.filter_by(disponivel=True)
    elif disponivel == "false":
        query = query.filter_by(disponivel=False)

    chaves = query.order_by(Chave.identificacao.asc()).all()

    return jsonify(
        [
            {
                "id": c.id,
                "identificacao": c.identificacao,
                "descricao": c.descricao,
                "disponivel": c.disponivel,
            }
            for c in chaves
        ]
    ), 200


# =========================================================
# 2) REGISTRAR ENTREGA DE UMA CHAVE
#    POST /api/entregas
#    body JSON:
#    {
#      "chave_id": 1,
#      "responsavel": "Nome da pessoa",
#      "contato": "(61) 9 9999-9999 / email",
#      "destino": "LAB-01 / sala tal",
#      "observacao": "opcional"
#    }
# =========================================================
@chaves_bp.route("/entregas", methods=["POST"])
def registrar_entrega():
    user_id = session.get("user_id")  # usuário logado
    if not user_id:
        return jsonify({"success": False, "message": "Não autenticado."}), 401

    data = request.get_json() or {}
    chave_id = data.get("chave_id")
    responsavel = data.get("responsavel")
    contato = data.get("contato")
    destino = data.get("destino")
    observacao = data.get("observacao")

    if not chave_id or not responsavel:
        return jsonify(
            {
                "success": False,
                "message": "Chave e responsável são obrigatórios.",
            }
        ), 400

    chave = Chave.query.get(chave_id)
    if not chave:
        return jsonify({"success": False, "message": "Chave não encontrada."}), 404

    if not chave.disponivel:
        return jsonify(
            {
                "success": False,
                "message": "Essa chave já está entregue e indisponível.",
            }
        ), 400

    entrega = Entrega(
        chave_id=chave.id,
        usuario_id=user_id,
        responsavel=responsavel,
        contato=contato,
        destino=destino,
        observacao=observacao,
        data_hora_entrega=datetime.utcnow(),
        devolvida=False,
        status="Pendente",  # <<< importante para o dashboard
    )

    chave.disponivel = False  # chave fica indisponível

    db.session.add(entrega)
    db.session.commit()

    return jsonify({"success": True, "entrega_id": entrega.id}), 201


# =========================================================
# 3) LISTAR ENTREGAS (opcionalmente só as abertas)
#    GET /api/entregas
#    GET /api/entregas?abertas=true
# =========================================================
@chaves_bp.route("/entregas", methods=["GET"])
def listar_entregas_abertas():
    abertas = request.args.get("abertas")  # "true" ou None
    query = Entrega.query

    if abertas == "true":
        query = query.filter_by(devolvida=False)

    entregas = query.order_by(Entrega.data_hora_entrega.desc()).all()

    return jsonify(
        [
            {
                "id": e.id,
                "chave_id": e.chave_id,
                "chave_identificacao": e.chave.identificacao if e.chave else None,
                "responsavel": e.responsavel,
                "contato": e.contato,
                "destino": e.destino,
                "observacao": e.observacao,
                "data_hora_entrega": e.data_hora_entrega.isoformat()
                if e.data_hora_entrega
                else None,
                "data_hora_devolucao": e.data_hora_devolucao.isoformat()
                if e.data_hora_devolucao
                else None,
                "devolvida": e.devolvida,
                "status": e.status,
            }
            for e in entregas
        ]
    ), 200


# =========================================================
# 4) REGISTRAR DEVOLUÇÃO DE UMA CHAVE
#    POST /api/entregas/<id>/devolver
# =========================================================
@chaves_bp.route("/entregas/<int:entrega_id>/devolver", methods=["POST"])
def registrar_devolucao(entrega_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"success": False, "message": "Não autenticado."}), 401

    entrega = Entrega.query.get(entrega_id)
    if not entrega:
        return jsonify(
            {"success": False, "message": "Registro de entrega não encontrado."}
        ), 404

    if entrega.devolvida:
        return jsonify(
            {"success": False, "message": "Essa entrega já foi devolvida."}
        ), 400

    # marca como devolvida
    entrega.devolvida = True
    entrega.data_hora_devolucao = datetime.utcnow()
    entrega.status = "Devolvido"  # <<< aqui atualiza o status

    # marca chave como disponível novamente
    if entrega.chave:
        entrega.chave.disponivel = True

    db.session.commit()

    return jsonify({"success": True}), 200
