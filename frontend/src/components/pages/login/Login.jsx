// src/components/pages/Login.jsx
import "./login.css";
import BgImage from "../../../assets/img/login-bg.png";
import Logo from "../../../assets/logos/logo.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API_URL } from "../../../config/api.js"; 

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);   // 👈 AQUI

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

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Erro ao fazer login.");
    }

    // ✅ chama a função recebida pela prop onLogin (vinda do App.jsx)
    if (typeof onLogin === "function") {
      onLogin(data.user); // aqui você marca como logado no App
    }

    // Salva o user_id junto com o login
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("isAuth", "true");

    navigate("/", { replace: true });
  } catch (err) {
    console.error("Erro no login:", err);
    if (err.message === "Failed to fetch") {
      setError("Não foi possível conectar ao servidor.");
    } else {
      setError(err.message);
    }
  }
  };

  return (
    <div className="login-page">
      <div className="login-page__left" style={{ backgroundImage: `url(${BgImage})` }}>
        <img src={Logo} alt="UDF Centro Universitário" className="login-left-logo" />
      </div>
      
  
      

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


  