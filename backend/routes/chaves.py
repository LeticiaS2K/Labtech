# backend/routes/chaves.py

from flask import Blueprint, jsonify, request, session, make_response
from datetime import datetime
from io import StringIO
import csv

from database import db
from Models.chave import Chave
from Models.entrega import Entrega

# ============================================
#  BLUEPRINT
# ============================================
chaves_bp = Blueprint("chaves", __name__, url_prefix="/api")


# ============================================
#  LISTAR CHAVES
# ============================================
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


# ============================================
#  REGISTRAR ENTREGA (ENTRAR UMA CHAVE)
# ============================================
@chaves_bp.route("/entregas", methods=["POST"])
def registrar_entrega():
    """
    POST /api/entregas
    body: {
      "chave_id": 1,
      "responsavel": "Nome da pessoa",
      "contato": "telefone ou email (opcional)",
      "destino": "LAB-01 / sala tal",
      "observacao": "texto livre (opcional)"
    }
    """
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autenticado."}), 401

    user_id = session["user_id"]

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
        status="Pendente",   # 👈 sempre começa como pendente
    )
    chave.disponivel = False

    db.session.add(entrega)
    db.session.commit()

    return jsonify({"success": True, "entrega_id": entrega.id}), 201


# ============================================
#  LISTAR ENTREGAS (ABERTAS OU TODAS)
# ============================================
@chaves_bp.route("/entregas", methods=["GET"])
def listar_entregas_abertas():
    """
    GET /api/entregas?abertas=true  -> só as não devolvidas
    GET /api/entregas               -> todas
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
            "data_hora_entrega": e.data_hora_entrega.isoformat() if e.data_hora_entrega else None,
            "data_hora_devolucao": e.data_hora_devolucao.isoformat() if e.data_hora_devolucao else None,
            "devolvida": e.devolvida,
            "status": getattr(e, "status", "Devolvido" if e.devolvida else "Pendente"),
        }
        for e in entregas
    ]), 200


# ============================================
#  DEVOLVER UMA CHAVE
# ============================================
@chaves_bp.route("/entregas/<int:entrega_id>/devolver", methods=["POST"])
def registrar_devolucao(entrega_id):
    """
    POST /api/entregas/<id>/devolver
    """
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autenticado."}), 401

    entrega = Entrega.query.get(entrega_id)
    if not entrega:
        return jsonify({"success": False, "message": "Registro de entrega não encontrado."}), 404

    if entrega.devolvida:
        return jsonify({"success": False, "message": "Essa entrega já foi devolvida."}), 400

    entrega.devolvida = True
    entrega.data_hora_devolucao = datetime.utcnow()
    entrega.status = "Devolvido"  # 👈 marcando como devolvido

    if entrega.chave:
        entrega.chave.disponivel = True

    db.session.commit()

    return jsonify({"success": True}), 200


# ============================================
#  HISTÓRICO (POR USUÁRIO LOGADO)
# ============================================
@chaves_bp.route("/historico", methods=["GET"])
def historico_entregas():
    """
    GET /api/historico
    Retorna histórico apenas do usuário logado.
    """
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autenticado."}), 401

    user_id = session["user_id"]

    query = (
        Entrega.query
        .join(Chave, Entrega.chave_id == Chave.id)
        .filter(Entrega.usuario_id == user_id)   # 👈 histórico individual
        .order_by(Entrega.data_hora_entrega.desc())
    )

    entregas = query.all()

    items = []
    for e in entregas:
        status_txt = getattr(e, "status", None)
        if not status_txt:
            status_txt = "Devolvido" if e.devolvida else "Pendente"

        status_class = "devolvido" if status_txt.lower().startswith("dev") else "pendente"

        items.append({
            "id": e.id,
            "chave_identificacao": e.chave.identificacao if e.chave else None,
            "tipo_sala": e.chave.descricao if e.chave else None,
            "destino": e.destino,
            "responsavel": e.responsavel,
            "contato": e.contato,
            "status": status_txt,
            "status_class": status_class,
            "data_hora_entrega": e.data_hora_entrega.isoformat() if e.data_hora_entrega else None,
            "data_hora_devolucao": e.data_hora_devolucao.isoformat() if e.data_hora_devolucao else None,
            "observacao": e.observacao,
        })

    return jsonify({"success": True, "items": items}), 200


# ============================================
#  EXPORTAR HISTÓRICO EM CSV (DO USUÁRIO)
# ============================================
@chaves_bp.route("/historico/export", methods=["GET"])
def exportar_historico():
    """
    GET /api/historico/export
    Gera CSV com histórico do usuário logado.
    """
    if "user_id" not in session:
        return jsonify({"success": False, "message": "Não autenticado."}), 401

    user_id = session["user_id"]

    query = (
        Entrega.query
        .join(Chave, Entrega.chave_id == Chave.id)
        .filter(Entrega.usuario_id == user_id)
        .order_by(Entrega.data_hora_entrega.desc())
    )

    entregas = query.all()

    buffer = StringIO()
    writer = csv.writer(buffer, delimiter=";")

    writer.writerow([
        "ID",
        "Chave",
        "Tipo / Descrição",
        "Destino",
        "Responsável",
        "Contato",
        "Status",
        "Data/Hora Entrega",
        "Data/Hora Devolução",
        "Observações",
    ])

    for e in entregas:
        status_txt = getattr(e, "status", None)
        if not status_txt:
            status_txt = "Devolvido" if e.devolvida else "Pendente"

        writer.writerow([
            e.id,
            e.chave.identificacao if e.chave else "",
            e.chave.descricao if e.chave else "",
            e.destino or "",
            e.responsavel or "",
            e.contato or "",
            status_txt,
            e.data_hora_entrega.strftime("%d/%m/%Y %H:%M") if e.data_hora_entrega else "",
            e.data_hora_devolucao.strftime("%d/%m/%Y %H:%M") if e.data_hora_devolucao else "",
            (e.observacao or "").replace("\n", " "),
        ])

    csv_data = buffer.getvalue()
    buffer.close()

    response = make_response(csv_data)
    response.headers["Content-Type"] = "text/csv; charset=utf-8"
    response.headers["Content-Disposition"] = 'attachment; filename="historico_chaves.csv"'
    return response
