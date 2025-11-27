import './chaves.css';
import Cards from '../../cards/Cards'
import { useNavigate } from 'react-router-dom';


// Dados das ações inferiores
const actionsubCardsData = [
  { label: "ENTREGA", route: "/entrega" },
  { label: "DEVOLUÇÃO", route: "/devolucao" },
];


// Componente para os subCards de Ação Inferiores
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

// Componente principal Chaves
export default function Chaves() {
  return (
    <div className="chaves-container">
      <Cards />
      <ActionsubCards />
    </div>
  );
}