// src/components/pages/reservas.jsx
import "./reservas.css";

// ajuste os caminhos/nome dos arquivos se forem diferentes aí
import CardReservasIcon from "../../../assets/icons/reservar.svg";
import CardChavesIcon from "../../../assets/icons/Chave.svg";
import CardMuralIcon from "../../../assets/icons/Calendar.svg";
import Cards from "../../cards/Cards";
export default function Reservas() {
  return (    
    <div className="reservas">
      {/* GRID INFERIOR */}
       <Cards/>         
      <section className="reservas__grid">
        {/* SALAS E RESERVAS */}
        <article className="panel panel--main">
          <h3 className="panel__title">SALAS E RESERVAS</h3>

          <ul className="stats-list">
            <li className="stats-item">
              <span className="stats-item__label">Total de salas:</span>
              <span className="stats-item__value">70</span>
            </li>
            <li className="stats-item">
              <span className="stats-item__label">Ocupadas:</span>
              <span className="stats-item__value">35</span>
            </li>
            <li className="stats-item">
              <span className="stats-item__label">Reservadas:</span>
              <span className="stats-item__value">15</span>
            </li>
            <li className="stats-item">
              <span className="stats-item__label">Disponíveis:</span>
              <span className="stats-item__value">20</span>
            </li>
          </ul>
        </article>

        {/* COLUNA DIREITA */}
        <div className="reservas__side">
          {/* DEVOLUÇÃO */}
          <article className="panel">
            <h3 className="panel__title panel__title--center">DEVOLUÇÃO</h3>

            <div className="status-pill">
              <span className="status-pill__label">Status :</span>
              <span className="status-pill__badge status-pill__badge--danger">
                PENDENTE
              </span>
            </div>
          </article>

          {/* ÚLTIMA ATUALIZAÇÃO */}
          <article className="panel">
            <h3 className="panel__title panel__title--center">
              ÚLTIMA ATUALIZAÇÃO
            </h3>

            <div className="info-pill">
              <span className="info-pill__label">Professor(a):</span>
              <span className="info-pill__value">ELIEL CRUZ</span>
            </div>

            <div className="info-pill">
              <span className="info-pill__label">Salas / Labs</span>
              <span className="info-pill__value">Lab 6</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
