// src/components/Sidebar/Sidebar.jsx
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

import HomeIcon from "../../assets/icons/Home.svg";
import CalendarIcon from "../../assets/icons/Calendar.svg";
import ChaveIcon from "../../assets/icons/Chave.svg";
import ProfileIcon from "../../assets/icons/profile.svg";
import EngrenagemIcon from "../../assets/icons/Engrenagem.svg";
import InterrogacaoIcon from "../../assets/icons/interrogacao.svg";
import SairIcon from "../../assets/icons/sair.svg";
import Reservas from "../../assets/icons/reservar.svg";

const topItems = [
  { id: "profile", label: "Profile", icon: ProfileIcon, path: "/profile" },
  { id: "home", label: "Home", icon: HomeIcon, path: "/" },
  { id: "reservas", label: "Salas e Reservas", icon: CalendarIcon, path: "/reservas" },
  { id: "chaves", label: "Chaves", icon: ChaveIcon, path: "/chaves" },
  { id: "mural", label: "Mural", icon: Reservas, path: "/mural" },
  { id: "config", label: "Configurações", icon: EngrenagemIcon, path: "/config" },
];

const bottomItems = [
  { id: "ajuda", label: "Ajuda", icon: InterrogacaoIcon, path: "/ajuda" },
  { id: "sair", label: "Sair", icon: SairIcon, path: "/login" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        {topItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              "sidebar__item" + (isActive ? " sidebar__item--active" : "")
            }
          >
            <img src={item.icon} alt={item.label} />
          </NavLink>
        ))}
      </div>

      <div className="sidebar__bottom">
        {bottomItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              "sidebar__item" + (isActive ? " sidebar__item--active" : "")
            }
          >
            <img src={item.icon} alt={item.label} />
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
