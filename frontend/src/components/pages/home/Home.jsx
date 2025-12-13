// src/components/pages/home/Home.jsx
import { useEffect, useState } from "react";
import "./home.css";

import Cards from "../../cards/Cards";
import { API_URL } from "../../../config/api.js";

export default function Home() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch(`${API_URL}/api/dashboard`, {
          credentials: "include",
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Erro ao carregar dashboard.");
        }

        setDashboard(data);
      } catch (err) {
        console.error("Erro ao buscar dashboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  // ========== DERIVADOS DO DASHBOARD ==========

  // aqui assumo que o backend manda algo como:
  // { success: true, stats: {...}, last_delivery: {...} }
  // ou { ..., ultima_mov: {...} }
  const stats = dashboard?.stats || {};
  const lastDelivery =
    dashboard?.last_delivery || dashboard?.ultima_mov || null;

    // 👇 Só pra você ver no console do navegador o que está vindo do backend
console.log("lastDelivery recebido da API:", lastDelivery);

// Monta o texto de "Salas / Labs" tentando vários nomes possíveis de campo
const salaLabsText = lastDelivery
  ? (() => {
      const identificacao =
        lastDelivery.chave_identificacao ||   // ex: "LAB-01"
        lastDelivery.identificacao ||
        lastDelivery.chave ||
        lastDelivery.sala ||
        lastDelivery.destino;

      const tipo =
        lastDelivery.tipo_sala ||             // ex: "Laboratório"
        lastDelivery.tipo ||
        lastDelivery.chave_tipo ||
        lastDelivery.chave_descricao ||
        lastDelivery.descricao;

      if (!identificacao && !tipo) return "-";
      if (!tipo) return identificacao;
      if (!identificacao) return tipo;
      return `${identificacao} - ${tipo}`;
    })()
  : "-";


  const totalChaves = stats.total_chaves ?? 0;
  const disponiveis = stats.disponiveis ?? 0;
  const pendentes = stats.pendentes ?? 0;

  // ocupadas = total - disponíveis
  const ocupadas =
    typeof totalChaves === "number" ? totalChaves - disponiveis : 0;

  // Reservadas ≈ pendentes (chaves em uso)
  const reservadas = pendentes;

  // STATUS GERAL NA PILULA "DEVOLUÇÃO"
  // tenta usar status da última entrega; se não tiver, define pela quantidade
  let rawStatus = lastDelivery?.status;

  if (!rawStatus) {
    if (pendentes > 0) {
      rawStatus = "Pendente";
    } else if ((stats.total_entregas ?? 0) === 0) {
      rawStatus = "Sem registros";
    } else {
      rawStatus = "Devolvido";
    }
  }

  const status = rawStatus.toUpperCase();

  const statusBadgeClass =
    status === "PENDENTE"
      ? "status-pill__badge status-pill__badge--danger"
      : "status-pill__badge";

  return (
    <div className="home">
      {/* CARDS SUPERIORES */}
      <Cards />

      {/* Erro simples, se houver */}
      {error && <p className="home-error">{error}</p>}

      {/* GRID INFERIOR */}
      <section className="home__grid">
        {/* SALAS E RESERVAS */}
        <article className="panel panel--main">
          <h3 className="panel__title">SALAS E RESERVAS</h3>

          <ul className="stats-list">
            <li className="stats-item">
              <span className="stats-item__label">Total de salas:</span>
              <span className="stats-item__value">
                {loading ? "…" : totalChaves}
              </span>
            </li>

            <li className="stats-item">
              <span className="stats-item__label">Ocupadas:</span>
              <span className="stats-item__value">
                {loading ? "…" : ocupadas}
              </span>
            </li>

            <li className="stats-item">
              <span className="stats-item__label">Reservadas:</span>
              <span className="stats-item__value">
                {loading ? "…" : reservadas}
              </span>
            </li>

            <li className="stats-item">
              <span className="stats-item__label">Disponíveis:</span>
              <span className="stats-item__value">
                {loading ? "…" : disponiveis}
              </span>
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
              <span className={statusBadgeClass}>
                {loading ? "CARREGANDO..." : status}
              </span>
            </div>
          </article>

          {/* ÚLTIMA ATUALIZAÇÃO – EXATAMENTE DO JEITO QUE VOCÊ POSTOU */}
          <article className="panel">
            <h3 className="panel__title panel__title--center">
              ÚLTIMA ATUALIZAÇÃO
            </h3>

            <div className="info-pill">
              <span className="info-pill__label">Professor(a):</span>
              <span className="info-pill__value">
                {lastDelivery?.responsavel || "-"}
              </span>
            </div>

            <div className="info-pill">
              <span className="info-pill__label">Salas / Labs</span>
              <span className="info-pill__value">
                {salaLabsText}
              </span>
            </div>
          </article>

        </div>
      </section>
    </div>
  );
}
