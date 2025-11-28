// src/components/pages/main.jsx
import "./cards.css";   

import CardReservasIcon from "../../assets/icons/reservar.svg";
import CardChavesIcon from "../../assets/icons/Chave.svg";
import CardMuralIcon from "../../assets/icons/Calendar.svg";

export default function Cards() {
  return (
    <div className="cards">
        <section className="main__cards">
        <article className="main-card">
          <div className="main-card__top">
            <div className="main-card__icon">
              <img src={CardReservasIcon} alt="Salas e Reservas" />
            </div>
            <span className="main-card__tag">UDF</span>
          </div>
          <h2 className="main-card__title">
            Salas e
            <br />
            Reservas
          </h2>
        </article>

        <article className="main-card">
          <div className="main-card__top">
            <div className="main-card__icon">
              <img src={CardChavesIcon} alt="Entrega e Recebimento de chaves" />
            </div>
            <span className="main-card__tag">UDF</span>
          </div>
          <h2 className="main-card__title">
            Entrega e
            <br />
            Recebimento de
            <br />
            chaves
          </h2>
        </article>

        {/* <article className="main-card">
          <div className="main-card__top">
            <div className="main-card__icon">
              <img src={CardMuralIcon} alt="Mural" />
            </div>
            <span className="main-card__tag">UDF</span>
          </div>
          <h2 className="main-card__title">Mural</h2>
        </article> */}
      </section>
    </div>
  );
}