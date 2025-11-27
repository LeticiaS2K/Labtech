// src/components/Header/Header.jsx
import "./Header.css";
import Logo from "../../assets/logos/logo.svg";

export default function Header() {
  return (
    <header className="header">
      {/* Logo UDF centralizada */}
      <div className="header__center">
        <img src={Logo} alt="UDF Centro Universitário" />
      </div>

      {/* Infos do usuário (opcional) */}
      <div className="header__right">
        <div className="header__user">
          <span className="header__user-name">Usuário</span>
          <span className="header__user-role">Administrador</span>
        </div>
      </div>
    </header>
  );
}