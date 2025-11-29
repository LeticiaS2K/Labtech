# routes/auth.py
from flask import Blueprint, request, jsonify, session, send_file, Response
import io
from database import db
from Models.usuario import Usuario  # cuidado com o M maiúsculo, confere igual à pasta

auth_bp = Blueprint("auth", __name__)

# ============ LOGIN ============
@auth_bp.route("/api/login", methods=["POST", "OPTIONS"])
def api_login():
    # Preflight CORS
    if request.method == "OPTIONS":
        return ("", 200)

    data = request.get_json() or {}
    email = data.get("email")
    senha = data.get("senha")

    if not email or not senha:
        return jsonify({
            "success": False,
            "message": "Informe e-mail e senha."
        }), 400

    user = Usuario.query.filter_by(email=email).first()
    if not user or not user.checar_senha(senha):
        return jsonify({
            "success": False,
            "message": "Credenciais inválidas."
        }), 401

    session.clear()
    session["user_id"] = user.id
    session["user_name"] = user.nome

    return jsonify({
        "success": True,
        "user": {
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "has_photo": getattr(user, "foto", None) is not None,
        },
    }), 200


# ============ REGISTER ============
@auth_bp.route("/api/register", methods=["POST", "OPTIONS"])
def api_register():
    # Preflight CORS
    if request.method == "OPTIONS":
        return ("", 200)

    data = request.get_json() or {}
    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")

    if not nome or not email or not senha:
        return jsonify({
            "success": False,
            "message": "Nome, e-mail e senha são obrigatórios."
        }), 400

    # e-mail já existe?
    existing = Usuario.query.filter_by(email=email).first()
    if existing:
        return jsonify({
            "success": False,
            "message": "Já existe um usuário com esse e-mail."
        }), 409

    novo = Usuario(nome=nome, email=email)
    novo.set_senha(senha)

    db.session.add(novo)
    db.session.commit()

    session.clear()
    session["user_id"] = novo.id
    session["user_name"] = novo.nome

    return jsonify({
        "success": True,
        "user": {
            "id": novo.id,
            "nome": novo.nome,
            "email": novo.email,
            "has_photo": getattr(novo, "foto", None) is not None,
        },
    }), 201


# ============ LOGOUT ============
@auth_bp.route("/api/logout", methods=["POST", "OPTIONS"])
def api_logout():
    if request.method == "OPTIONS":
        return ("", 200)

    session.clear()
    return jsonify({"success": True}), 200

# ---------- SAVE PHOTO ----------
@auth_bp.route("/api/users/me/photo", methods=["POST"])
def upload_photo():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"success": False, "message": "Não autenticado."}), 401

    if "foto" not in request.files:
        return jsonify({"success": False, "message": "Nenhum arquivo enviado."}), 400

    file = request.files["foto"]
    if file.filename == "":
        return jsonify({"success": False, "message": "Arquivo inválido."}), 400

    mime_type = file.mimetype  # ex: image/jpeg

    user = Usuario.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": "Usuário não encontrado."}), 404

    user.foto = file.read()
    user.foto_mime_type = mime_type
    db.session.commit()

    return jsonify({"success": True}), 200


# GET /api/users/<id>/photo -> devolve a imagem
@auth_bp.route("/api/users/<int:user_id>/photo", methods=["GET"])
def get_user_photo(user_id):
    user = Usuario.query.get(user_id)
    if not user or not user.foto:
        return Response(status=204)  # sem conteúdo

    return Response(user.foto, mimetype=user.foto_mime_type or "image/jpeg")

# ---------- ALTERAR DADOS ----------
# ... (login, register, upload_photo, etc) ...

@auth_bp.route("/api/users/me", methods=["PUT"])
def update_me():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"success": False, "message": "Não autenticado."}), 401

    data = request.get_json() or {}
    nome = data.get("nome")
    email = data.get("email")
    senha_atual = data.get("senha_atual")
    nova_senha = data.get("nova_senha")

    if not nome or not email:
        return jsonify({
            "success": False,
            "message": "Nome e e-mail são obrigatórios."
        }), 400

    user = Usuario.query.get(user_id)
    if not user:
        return jsonify({"success": False, "message": "Usuário não encontrado."}), 404

    # se e-mail foi alterado, verifica se já existe outro igual
    if email != user.email:
        if Usuario.query.filter_by(email=email).first():
            return jsonify({
                "success": False,
                "message": "Já existe um usuário com esse e-mail."
            }), 409

    # atualiza nome e e-mail
    user.nome = nome
    user.email = email

    # se veio nova senha, exige senha atual correta
    if nova_senha:
        if not senha_atual or not user.checar_senha(senha_atual):
            return jsonify({
                "success": False,
                "message": "Senha atual incorreta."
            }), 400
        user.set_senha(nova_senha)

    db.session.commit()

    # atualiza nome da sessão
    session["user_name"] = user.nome

    return jsonify({
        "success": True,
        "user": {
            "id": user.id,
            "nome": user.nome,
            "email": user.email,
            "has_photo": user.foto is not None if hasattr(user, "foto") else False,
        }
    }), 200
