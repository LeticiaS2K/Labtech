// src/components/pages/Register.jsx
import "./register.css"; // pode reaproveitar os estilos do login
import BgImage from "../../../assets/img/login-bg.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../../../config/api.js";


export default function Register({ onLogin }) {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (senha !== confirmarSenha) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erro ao registrar usuário.");
      }

      // guarda algo se quiser
      localStorage.setItem("user_name", data.user.nome);

      // já usa o mesmo fluxo de login
      if (typeof onLogin === "function") {
        onLogin(data.user);
      }

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Erro no registro:", err);
      if (err.message === "Failed to fetch") {
        setError("Não foi possível conectar ao servidor.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h1 className="register-title">Criar conta</h1>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-form__group">
            <label htmlFor="nome">Nome completo</label>
            <input
              id="nome"
              type="text"
              className="register-input"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="register-form__group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              className="register-input"
              placeholder="usuario@udf.edu.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="register-form__group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              className="register-input"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="register-form__group">
            <label htmlFor="confirmarSenha">Confirmar senha</label>
            <input
              id="confirmarSenha"
              type="password"
              className="register-input"
              placeholder="********"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>

          {error && <p className="register-error">{error}</p>}

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </button>

          <p className="register-login-text">
            Já tem conta?{" "}
            <button
              type="button"
              className="register-link-btn"
              onClick={() => navigate("/login")}
            >
              Fazer login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

