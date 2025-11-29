import './chaves.css';
import Cards from '../../cards/Cards'
import { useNavigate } from 'react-router-dom';

const actionsubCardsData = [
  { label: "ENTREGA", route: "/entrega" },
  { label: "DEVOLUÇÃO", route: "/devolucao" },
];

const ActionsubCards = () => {
  const navigate = useNavigate();

  return (
    <section className="action-subcards-grid">
      {actionsubCardsData.map((subcard, index) => (
        <article key={index} className="action-subcard">
          <h3 className="action-title">{subcard.label}</h3>
          <button
            className="action-button"
            onClick={() => navigate(subcard.route)}
          >
            ENTRAR
          </button>
        </article>
      ))}
    </section>
  );
};

export default function Chaves() {
  return (
    <div className="chaves-container">
      <Cards />
      <ActionsubCards />
    </div>
  );
}
