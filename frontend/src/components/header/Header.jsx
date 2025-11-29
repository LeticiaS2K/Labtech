// src/components/Header/Header.jsx
import "./Header.css";
import Logo from "../../assets/logos/logo.svg";

const API_URL = "http://localhost:5000";

export default function Header({ user }) {
  const initial =
    user?.nome?.trim()?.charAt(0)?.toUpperCase() || "U";

  const hasPhoto = user?.has_photo;
  const photoUrl = hasPhoto
    ? `${API_URL}/api/users/${user.id}/photo`
    : null;

  return (
    <header className="header">
      <div className="header__center">
        <img src={Logo} alt="UDF Centro Universitário" />
      </div>

      <div className="header__right">
        <div className="header__avatar">
          {photoUrl ? (
            <img src={photoUrl} alt={user?.nome || "Foto de perfil"} />
          ) : (
            <span>{initial}</span>
          )}
        </div>

        <div className="header__user">
          <span className="header__user-name">
            {user?.nome || "Usuário"}
          </span>
          <span className="header__user-role">
            {user?.email || "Administrador"}
          </span>
        </div>
      </div>
    </header>
  );
}
