// src/components/pages/Register.jsx
import "./register.css"; // pode reaproveitar os estilos do login
import BgImage from "../../../assets/img/login-bg.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = "http://localhost:5000";

export default function Register({ onLogin }) {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (senha !== confirmaSenha) {
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

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erro ao cadastrar");
      }

      // guarda algo se quiser
      localStorage.setItem("user_name", data.user.nome);

      if (typeof onLogin === "function") {
        onLogin(data.user); // data.user vem da API Flask
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-page">
      <div
        className="login-page__left"
        style={{ backgroundImage: `url(${BgImage})` }}
      />

      <div className="login-page__right">
        <div className="login-box">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: "8px" }}>Criar conta</h2>

            <div className="login-form__group">
              <label htmlFor="nome">Nome completo</label>
              <input
                id="nome"
                type="text"
                placeholder="Seu nome"
                className="login-input"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="login-form__group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="Seu e-mail institucional"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-form__group">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                placeholder="********"
                className="login-input"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div className="login-form__group">
              <label htmlFor="confirmaSenha">Confirmar senha</label>
              <input
                id="confirmaSenha"
                type="password"
                placeholder="********"
                className="login-input"
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Criando conta..." : "Inscrever-se"}
            </button>

            <p className="login-signup-text">
              Já tem conta?{" "}
              <button
                type="button"
                className="login-link-btn login-link-btn--accent"
                onClick={handleBackToLogin}
              >
                Fazer login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
