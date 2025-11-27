// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="app__main">
        <Header />

        <main className="app__content">
          <Routes>
             <Route path="/profile" element={<Profile />} />
             <Route path="/" element={<Home />} />
             <Route path="/login" element={<Login />} />
             <Route path="/chaves" element={<Chaves />} />
             <Route path="/reservas" element={<Reservas />} />
             <Route path="/mural" element={<Mural />} />
             <Route path="/config" element={<Config />} />
             <Route path="/ajuda" element={<Ajuda />} />
             {/* você pode ir adicionando mais páginas aqui */}
             <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;


// <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/chaves" element={<Chaves />} />
//             <Route path="/reservas" element={<Reservas />} />
//             <Route path="/mural" element={<Mural />} />
//             <Route path="/config" element={<Config />} />
//             <Route path="/ajuda" element={<Ajuda />} />
//             {/* você pode ir adicionando mais páginas aqui */}
//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
