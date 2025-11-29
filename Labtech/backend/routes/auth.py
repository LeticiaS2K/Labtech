from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from database import db
from models.usuario import Usuario

auth_bp = Blueprint("auth", __name__, template_folder="../templates")

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        senha = request.form.get("senha")
        user = Usuario.query.filter_by(email=email).first()
        if user and user.checar_senha(senha):
            session["user_id"] = user.id
            session["user_name"] = user.nome
            return redirect(url_for("dashboard.index"))
        flash("Email ou senha inválidos", "error")
    return render_template("login.html")

@auth_bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("auth.login"))
