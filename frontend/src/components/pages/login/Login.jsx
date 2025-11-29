// src/components/pages/Login.jsx
import "./login.css";
import BgImage from "../../../assets/img/login-bg.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL = "http://localhost:5000"; // porta do Flask

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",        
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Erro ao fazer login.");
    }

    onLoginSuccess(data.user);
  } catch (err) {
    setError(err.message);
  }
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
            <div className="login-form__group">
              <label htmlFor="email">E-mail:</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-form__group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="********"
                className="login-input"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <div className="login-form__row">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Lembre-me</span>
              </label>

              <button
                type="button"
                className="login-link-btn login-link-btn--small"
              >
                Esqueci minha senha
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Entrando..." : "Login"}
            </button>

            <p className="login-signup-text">
              Não tem conta?{" "}
              <button
                type="button"
                className="login-link-btn login-link-btn--accent"
                onClick={() => navigate("/register")}
              >
                Inscrever-se
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}