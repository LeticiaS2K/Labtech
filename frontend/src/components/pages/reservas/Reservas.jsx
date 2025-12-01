// src/components/pages/reservas.jsx
import "../home/home.css";

// ajuste os caminhos/nome dos arquivos se forem diferentes aí
import CardReservasIcon from "../../../assets/icons/reservar.svg";
import CardChavesIcon from "../../../assets/icons/Chave.svg";
import CardMuralIcon from "../../../assets/icons/Calendar.svg";
import Cards from "../../cards/Cards";
import Home from "../home/Home";
export default function Reservas() {
  return (    
    <div className="reservas">
      {/* GRID INFERIOR */}        
       <Home/>   
    </div>
  );
}
