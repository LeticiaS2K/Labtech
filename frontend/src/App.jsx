import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react"; // 1. Importado useState

import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Header from "./components/header/Header.jsx";

import Home from "./components/pages/home/Home.jsx";
import Login from "./components/pages/login/Login.jsx";
import Chaves from "./components/pages/chaves/Chaves.jsx";
import Reservas from "./components/pages/reservas/Reservas.jsx";
import Mural from "./components/pages/mural/Mural.jsx";
import Config from "./components/pages/configurações/Config.jsx";
import Ajuda from "./components/pages/ajuda/Ajuda.jsx";
import Profile from "./components/profile/Profile.jsx";
import Register from "./components/pages/register/Register.jsx";

// Páginas Entrega / Devolução
import Entrega from "./components/pages/entrega/Entrega.jsx";
import Devolucao from "./components/pages/devolucao/Devolucao.jsx";

function App() {
  const location = useLocation();


  // estado global da sidebar
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // estado do avatar
  const [avatar, setAvatar] = useState(
    () => localStorage.getItem("profileAvatar") || null
  );

  // estado de autenticação (com persistência simples no localStorage)
  const [isAuth, setIsAuth] = useState(
    () => localStorage.getItem("isAuth") === "true"
  );

  // 👇 novo: usuário logado
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLoginSuccess = (userData) => {
    setIsAuth(true);
    localStorage.setItem("isAuth", "true");

    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setIsAuth(false);
    setUser(null);
    localStorage.removeItem("isAuth");
    localStorage.removeItem("user");
  };

  // caminhos que são páginas de autenticação (sem sidebar/header)
  const authPaths = ["/login", "/register"];
  const isAuthPage = authPaths.includes(location.pathname);

  // se NÃO estiver logado e NÃO estiver em página de auth → manda pro /login
  if (!isAuth && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // se JÁ estiver logado e tentar ir para /login ou /register → manda pra home
  if (isAuth && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  // ======= LAYOUT ESPECIAL: TELAS DE AUTENTICAÇÃO (SEM SIDEBAR/HEADER) =======
  if (isAuthPage) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLoginSuccess} />}
        />
        <Route
          path="/register"
          element={<Register onLogin={handleLoginSuccess} />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // ======= LAYOUT PRINCIPAL (COM SIDEBAR + HEADER) =======
  return (
    <div className={`app ${!isSidebarExpanded ? "app--sidebar-collapsed" : ""}`}>
    <Sidebar
      user={user}
      // avatar={avatar}                      // 👈 passa o usuário
      onLogout={handleLogout}
      isExpanded={isSidebarExpanded}
      setIsExpanded={setIsSidebarExpanded}
    />

      <div className="app__main">
        <Header user={user} />

        <main className="app__content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile user={user} onUserChange={setUser} />} />

            <Route path="/chaves" element={<Chaves />} />
            <Route path="/entrega" element={<Entrega />} />
            <Route path="/devolucao" element={<Devolucao />} />

            <Route path="/reservas" element={<Reservas />} />
            <Route path="/mural" element={<Mural />} />
            <Route path="/config" element={<Config />} />
            <Route path="/ajuda" element={<Ajuda />} />

            {/* qualquer rota desconhecida, logado, volta pra home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;