import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import HomeIcon from "../../assets/icons/Home.svg";
import CalendarIcon from "../../assets/icons/Calendar.svg";
import ChaveIcon from "../../assets/icons/Chave.svg";
import InterrogacaoIcon from "../../assets/icons/interrogacao.svg";
import SairIcon from "../../assets/icons/sair.svg";

export default function Sidebar({ onLogout, isExpanded, setIsExpanded }) {
  const [avatar, setAvatar] = useState(null);

  // ✅ Carrega a foto do localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem("profileAvatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }

    // ✅ Escuta mudanças no storage (quando trocar a foto no Profile)
    const handleStorageChange = () => {
      const updatedAvatar = localStorage.getItem("profileAvatar");
      setAvatar(updatedAvatar);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const topItems = [
    {
      id: "profile",
      label: "Profile",
      path: "/profile",
      isProfile: true, // ✅ flag especial
    },
    { id: "home", label: "Home", icon: HomeIcon, path: "/" },
    { id: "reservas", label: "Salas e Reservas", icon: CalendarIcon, path: "/reservas" },
    { id: "chaves", label: "Chaves", icon: ChaveIcon, path: "/chaves" },
  ];

  const bottomItems = [
    { id: "ajuda", label: "Ajuda", icon: InterrogacaoIcon, path: "/ajuda", type: "link" },
    { id: "sair", label: "Sair", icon: SairIcon, type: "logout" },
  ];

  return (
    <aside className={`sidebar ${isExpanded ? "sidebar--expanded" : ""}`}>

      {/* ✅ BOTÃO DA SETINHA */}
      <button
        className="sidebar__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "❮" : "❯"}
      </button>

      <div className="sidebar__top">
        {topItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              "sidebar__item" + (isActive ? " sidebar__item--active" : "")
            }
          >
            {/* ✅ SE FOR O PROFILE, MOSTRA FOTO */}
            {item.isProfile ? (
              avatar ? (
                <img
                  src={avatar}
                  alt="Foto de perfil"
                  className="sidebar__avatar"
                />
              ) : (
                <div className="sidebar__avatar sidebar__avatar--placeholder">
                  U
                </div>
              )
            ) : (
              <img src={item.icon} alt={item.label} />
            )}

            {isExpanded && <span>{item.label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="sidebar__bottom">
        {bottomItems.map((item) => {
          if (item.type === "logout") {
            return (
              <button
                key={item.id}
                className="sidebar__item"
                type="button"
                onClick={onLogout}
              >
                <img src={item.icon} alt={item.label} />
                {isExpanded && <span>{item.label}</span>}
              </button>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                "sidebar__item" + (isActive ? " sidebar__item--active" : "")
              }
            >
              <img src={item.icon} alt={item.label} />
              {isExpanded && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
