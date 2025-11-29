// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

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
import Entrega from "./components/pages/entrega/Entrega.jsx";
import Devolucao from "./components/pages/devolucao/Devolucao.jsx";

// ===== helper para montar layout com sidebar + header =====
function AppLayout({ children, user, onLogout, isSidebarExpanded, setIsSidebarExpanded }) {
  return (
    <div className={`app ${!isSidebarExpanded ? "app--sidebar-collapsed" : ""}`}>
      <Sidebar
        user={user}
        onLogout={onLogout}
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      <div className="app__main">
        <Header user={user} />
        <main className="app__content">{children}</main>
      </div>
    </div>
  );
}

function App() {
  // estado global da sidebar
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // estado de autenticação (com persistência simples no localStorage)
  const [isAuth, setIsAuth] = useState(
    () => localStorage.getItem("isAuth") === "true"
  );

  // usuário logado
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

  // ===== rotas =====
  return (
    <Routes>
      {/* TELAS DE AUTENTICAÇÃO (SEM SIDEBAR/HEADER) */}
      <Route
        path="/login"
        element={
          isAuth ? (
            <Navigate to="/" replace />
          ) : (
            <Login onLogin={handleLoginSuccess} />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuth ? (
            <Navigate to="/" replace />
          ) : (
            <Register onLogin={handleLoginSuccess} />
          )
        }
/>

      {/* ROTAS PROTEGIDAS (COM LAYOUT) */}
      <Route
        path="/"
        element={
          isAuth ? (
            <AppLayout
              user={user}
              onLogout={handleLogout}
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            >
              <Home />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/profile"
        element={
          isAuth ? (
            <AppLayout
              user={user}
              onLogout={handleLogout}
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            >
              <Profile user={user} onUserChange={setUser} />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/chaves"
        element={
          isAuth ? (
            <AppLayout
              user={user}
              onLogout={handleLogout}
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            >
              <Chaves />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/entrega"
        element={
          isAuth ? (
            <AppLayout
              user={user}
              onLogout={handleLogout}
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            >
              <Entrega />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/devolucao"
        element={
          isAuth ? (
            <AppLayout
              user={user}
              onLogout={handleLogout}
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            >
              <Devolucao />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/reservas"
        element={
          isAuth ? (
            <AppLayout
              user={user}
              onLogout={handleLogout}
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            >
              <Reservas />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/mural"
        element={
          isAuth ? (
            <AppLayout
              user={user}
              onLogout={handleLogout}
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            >
              <Mural />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/config"
        element={
          isAuth ? (
            <AppLayout
              user={user}
              onLogout={handleLogout}
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            >
              <Config />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/ajuda"
        element={
          isAuth ? (
            <AppLayout
              user={user}
              onLogout={handleLogout}
              isSidebarExpanded={isSidebarExpanded}
              setIsSidebarExpanded={setIsSidebarExpanded}
            >
              <Ajuda />
            </AppLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* fallback */}
      <Route
        path="*"
        element={
          isAuth ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
