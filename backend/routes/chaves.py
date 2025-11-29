# backend/routes/chaves.py
from flask import Blueprint, jsonify, request, session
from datetime import datetime
from database import db
from Models.chave import Chave
from Models.entrega import Entrega   # vou mostrar um modelo base abaixo

chaves_bp = Blueprint("chaves", __name__, url_prefix="/api")


# ========== LISTAR CHAVES ==========
@chaves_bp.route("/chaves", methods=["GET"])
def listar_chaves():
    """
    GET /api/chaves
    GET /api/chaves?disponivel=true
    GET /api/chaves?disponivel=false
    """
    disponivel = request.args.get("disponivel")
    query = Chave.query

    if disponivel == "true":
        query = query.filter_by(disponivel=True)
    elif disponivel == "false":
        query = query.filter_by(disponivel=False)

    chaves = query.order_by(Chave.identificacao.asc()).all()

    return jsonify([
        {
            "id": c.id,
            "identificacao": c.identificacao,
            "descricao": c.descricao,
            "disponivel": c.disponivel,
        }
        for c in chaves
    ]), 200


# ========== ENTRAR UMA CHAVE (ENTREGA) ==========
@chaves_bp.route("/entregas", methods=["POST"])
def registrar_entrega():
    """
    POST /api/entregas
    body: {
      "chave_id": 1,
      "responsavel": "Nome da pessoa",
      "contato": "opcional, telefone/email",
      "destino": "LAB-01 / sala tal",
      "observacao": "opcional"
    }
    """
    user_id = session.get("user_id")  # quem fez o registro (usuário logado)
    if not user_id:
        return jsonify({"success": False, "message": "Não autenticado."}), 401

    data = request.get_json() or {}
    chave_id = data.get("chave_id")
    responsavel = data.get("responsavel")
    contato = data.get("contato")
    destino = data.get("destino")
    observacao = data.get("observacao")

    if not chave_id or not responsavel:
        return jsonify({
            "success": False,
            "message": "Chave e responsável são obrigatórios."
        }), 400

    chave = Chave.query.get(chave_id)
    if not chave:
        return jsonify({"success": False, "message": "Chave não encontrada."}), 404

    if not chave.disponivel:
        return jsonify({
            "success": False,
            "message": "Essa chave já está entregue e indisponível."
        }), 400

    entrega = Entrega(
        chave_id=chave.id,
        usuario_id=user_id,
        responsavel=responsavel,
        contato=contato,
        destino=destino,
        observacao=observacao,
        data_hora_entrega=datetime.utcnow(),
        devolvida=False,
    )
    chave.disponivel = False

    db.session.add(entrega)
    db.session.commit()

    return jsonify({"success": True, "entrega_id": entrega.id}), 201


# ========== LISTAR ENTREGAS ABERTAS (PARA DEVOLUÇÃO) ==========
@chaves_bp.route("/entregas", methods=["GET"])
def listar_entregas_abertas():
    """
    GET /api/entregas?abertas=true  -> só as que não foram devolvidas
    """
    abertas = request.args.get("abertas")
    query = Entrega.query

    if abertas == "true":
        query = query.filter_by(devolvida=False)

    entregas = query.order_by(Entrega.data_hora_entrega.desc()).all()

    return jsonify([
        {
            "id": e.id,
            "chave_id": e.chave_id,
            "chave_identificacao": e.chave.identificacao if e.chave else None,
            "responsavel": e.responsavel,
            "contato": e.contato,
            "destino": e.destino,
            "observacao": e.observacao,
            "data_hora_entrega": e.data_hora_entrega.isoformat(),
            "devolvida": e.devolvida,
        }
        for e in entregas
    ]), 200


# ========== DEVOLVER UMA CHAVE ==========
@chaves_bp.route("/entregas/<int:entrega_id>/devolver", methods=["POST"])
def registrar_devolucao(entrega_id):
    """
    POST /api/entregas/<id>/devolver
    """
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"success": False, "message": "Não autenticado."}), 401

    entrega = Entrega.query.get(entrega_id)
    if not entrega:
        return jsonify({"success": False, "message": "Registro de entrega não encontrado."}), 404

    if entrega.devolvida:
        return jsonify({"success": False, "message": "Essa entrega já foi devolvida."}), 400

    entrega.devolvida = True
    entrega.data_hora_devolucao = datetime.utcnow()

    # marca chave como disponível novamente
    if entrega.chave:
        entrega.chave.disponivel = True

    db.session.commit()

    return jsonify({"success": True}), 200
