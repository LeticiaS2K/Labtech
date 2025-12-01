// src/components/pages/home/Home.jsx
import "./home.css";
import Cards from "../../cards/Cards";
import { useEffect, useState } from "react";
import { API_URL } from "../../../config/api.js";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [lastDelivery, setLastDelivery] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch(`${API_URL}/api/dashboard`, {
          credentials: "include", // envia cookie de sessão
        });

        if (res.status === 401) {
          setError("Não autenticado.");
          return;
        }

        const data = await res.json().catch(() => ({}));

        if (!data.success) {
          throw new Error(data.message || "Erro ao carregar dashboard.");
        }

        setStats(data.stats || null);
        setLastDelivery(data.last_delivery || null);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setError(err.message);
      }
    }

    loadDashboard();
  }, []);

  // Valores de fallback se ainda não carregou
  const totalChaves = stats?.total_chaves ?? 0;
  const disponiveis = stats?.disponiveis ?? 0;

  // aqui estou assumindo:
  // ocupadas = total - disponíveis
  const ocupadas =
    stats && typeof stats.total_chaves === "number"
      ? stats.total_chaves - (stats.disponiveis || 0)
      : 0;

  // e "Reservadas" ≈ pendentes
  const reservadas = stats?.pendentes ?? 0;

  // status / professor / sala
  const status = (lastDelivery?.status || "Pendente").toUpperCase();
  const professor = lastDelivery?.responsavel || "—";
  const sala = lastDelivery?.sala || "—";

  // classe extra pro badge de status (mantendo seu CSS)
  const statusBadgeClass =
    status === "PENDENTE"
      ? "status-pill__badge status-pill__badge--danger"
      : "status-pill__badge";

  return (
    <div className="home">
      {/* CARDS SUPERIORES */}
      <Cards />

      {/* se quiser, pode mostrar erro simples aqui */}
      {error && <p className="home-error">{error}</p>}

      {/* GRID INFERIOR */}
      <section className="home__grid">
        {/* SALAS E RESERVAS */}
        <article className="panel panel--main">
          <h3 className="panel__title">SALAS E RESERVAS</h3>

          <ul className="stats-list">
            <li className="stats-item">
              <span className="stats-item__label">Total de salas:</span>
              <span className="stats-item__value">{totalChaves}</span>
            </li>
            <li className="stats-item">
              <span className="stats-item__label">Ocupadas:</span>
              <span className="stats-item__value">{ocupadas}</span>
            </li>
            <li className="stats-item">
              <span className="stats-item__label">Reservadas:</span>
              <span className="stats-item__value">{reservadas}</span>
            </li>
            <li className="stats-item">
              <span className="stats-item__label">Disponíveis:</span>
              <span className="stats-item__value">{disponiveis}</span>
            </li>
          </ul>
        </article>

        {/* COLUNA DIREITA */}
        <div className="home__side">
          {/* DEVOLUÇÃO */}
          <article className="panel">
            <h3 className="panel__title panel__title--center">DEVOLUÇÃO</h3>

            <div className="status-pill">
              <span className="status-pill__label">Status :</span>
              <span className={statusBadgeClass}>{status}</span>
            </div>
          </article>

          {/* ÚLTIMA ATUALIZAÇÃO */}
          <article className="panel">
            <h3 className="panel__title panel__title--center">
              ÚLTIMA ATUALIZAÇÃO
            </h3>

            <div className="info-pill">
              <span className="info-pill__label">Professor(a):</span>
              <span className="info-pill__value">{professor}</span>
            </div>

            <div className="info-pill">
              <span className="info-pill__label">Tipo:</span>
              <span className="info-pill__value">{sala}</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
