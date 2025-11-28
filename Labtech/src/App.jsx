import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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

// ✅ PÁGINAS DE ENTREGA E DEVOLUÇÃO
import Entrega from "./components/pages/entrega/Entrega.jsx";
import Devolucao from "./components/pages/devolucao/Devolucao.jsx";

function App() {
  const location = useLocation();

  // estado de autenticação (com persistência simples no localStorage)
  const [isAuth, setIsAuth] = useState(
    () => localStorage.getItem("isAuth") === "true"
  );

  const handleLoginSuccess = () => {
    setIsAuth(true);
    localStorage.setItem("isAuth", "true");
  };

  const handleLogout = () => {
    setIsAuth(false);
    localStorage.removeItem("isAuth");
  };

  const isLoginPage = location.pathname === "/login";

  // se NÃO estiver logado e NÃO estiver na tela de login,
  // manda pra /login
  if (!isAuth && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  // se JÁ estiver logado e tentar ir pra /login, manda pra home
  if (isAuth && isLoginPage) {
    return <Navigate to="/" replace />;
  }

  // ======= LAYOUT ESPECIAL: LOGIN (sem menu / header) =======
  if (isLoginPage) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={handleLoginSuccess} />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }


  return (
    
    <div className="app">
      <Sidebar onLogout={handleLogout} />

      <div className="app__main">
        <Header />

        <main className="app__content">
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route path="/chaves" element={<Chaves />} />
            <Route path="/entrega" element={<Entrega />} />     
            <Route path="/devolucao" element={<Devolucao />} />  

            <Route path="/reservas" element={<Reservas />} />
            {/* <Route path="/mural" element={<Mural />} />
            <Route path="/config" element={<Config />} /> */}
            <Route path="/ajuda" element={<Ajuda />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
