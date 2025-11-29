# routes/auth.py
from flask import Blueprint, request, jsonify, session
from database import db
from Models.usuario import Usuario  # cuidado com o M maiúsculo, confere igual à pasta

auth_bp = Blueprint("auth", __name__)

# ---------- LOGIN VIA API (React) ----------
@auth_bp.route("/api/register", methods=["POST"])
def api_register():
    data = request.get_json() or {}
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")

    if not nome or not email or not senha:
        return jsonify({
            "success": False,
            "message": "Nome, e-mail e senha são obrigatórios."
        }), 400

    # verifica se já existe usuário com esse e-mail
    if Usuario.query.filter_by(email=email).first():
        return jsonify({
            "success": False,
            "message": "Já existe um usuário com esse e-mail."
        }), 409

    # cria usuário
    user = Usuario(nome=nome, email=email)
    user.set_senha(senha)

    db.session.add(user)
    db.session.commit()

    # opcional: já loga o usuário na sessão Flask
    session["user_id"] = user.id
    session["user_name"] = user.nome

    return jsonify({
        "success": True,
        "user": {
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
        }
    }), 201


@auth_bp.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json() or {}
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({"success": False, "message": "Email e senha são obrigatórios."}), 400

    user = Usuario.query.filter_by(email=email).first()

    if user and user.checar_senha(senha):
        # guarda na sessão (cookie) se quiser usar do lado do Flask
        session["user_id"] = user.id
        session["user_name"] = user.nome

        return jsonify({
            "success": True,
            "user": {
                "id": user.id,
                "nome": user.nome,
                "email": user.email,
            }
        }), 200

    return jsonify({"success": False, "message": "Email ou senha inválidos."}), 401


# ---------- LOGOUT VIA API ----------
@auth_bp.route("/api/logout", methods=["POST"])
def api_logout():
    session.clear()
    return jsonify({"success": True}), 200
