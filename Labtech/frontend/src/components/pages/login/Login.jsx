// src/components/pages/Login.jsx
import "./login.css";
import BgImage from "../../../assets/img/login-bg.png";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // aqui você colocaria a validação real (API, etc.)
    // por enquanto, qualquer coisa "loga":
    if (typeof onLogin === "function") {
      onLogin();
    }

    // depois de logar, manda pra Home
    navigate("/", { replace: true });
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
              />
            </div>

            <div className="login-form__group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="********"
                className="login-input"
              />
            </div>

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

            <button type="submit" className="login-btn">
              Login
            </button>

            <p className="login-signup-text">
              Não tem conta?{" "}
              <button
                type="button"
                className="login-link-btn login-link-btn--accent"
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