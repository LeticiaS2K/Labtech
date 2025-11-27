import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import './devolucao.css'

const initialLoanData = {
  sala: "Laboratório 6",
  emprestadoPara: "Eliel Cruz",
  retiradoEm: "21/10/2025 - 8:30",
  previsaoDevolucao: "21/10/2025 - 11:38",
  status: "Devolução Pendente"
};

// Componente auxiliar para exibir um item de detalhe (campo de dados fixo)
const DetailItem = ({ label, value }) => (
  <div className="detail-item-group">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value}</span>
  </div>
);


export default function Devolucao() {
  // Estado para os dados de empréstimo (simulados)
  const [loanData, setLoanData] = useState(initialLoanData);
  
  // Estado para o formulário de confirmação de devolução
  const [confirmationData, setConfirmationData] = useState({
    idChave: '',
    dataHoraEntrega: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfirmationData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    console.log('Confirmação de Devolução:', { ...loanData, ...confirmationData });
    console.error('Devolução de chave confirmada com sucesso (simulação).');
  };

  const handleCancel = () => {
    console.log('Operação de confirmação de devolução cancelada.');
    setConfirmationData({
      idChave: '',
      dataHoraEntrega: '',
    });
  };

  return (
    <div className="devolucao-chaves-container">
      
      {/* Título Principal */}
      <div className="title-section">
        <h1 className="main-title">DEVOLUÇÃO DE CHAVES</h1>
        <p className="main-subtitle">Devolução rápida e segura</p>
      </div>

      {/* Conteúdo Principal */}
      <div className="main-content-grid">
        
        {/* Lado Esquerdo */}
        <section className="loan-details-card">
          <DetailItem label="SALA" value={loanData.sala} />
          <DetailItem label="EMPRESTADO PARA" value={loanData.emprestadoPara} />
          <DetailItem label="RETIRADO EM" value={loanData.retiradoEm} />
          <DetailItem label="PREVISÃO DE DEVOLUÇÃO" value={loanData.previsaoDevolucao} />
          <DetailItem label="STATUS" value={loanData.status} />
        </section>

        {/* Lado Direito */}
        <section className="confirmation-card">
          <h2 className="confirmation-title">CONFIRMAÇÃO DE DEVOLUÇÃO</h2>

          <form onSubmit={handleConfirm} className="confirmation-form">
            
            <div className="form-field-group">
              <label htmlFor="idChave" className="form-label">ID Chave:</label>
              <input
                id="idChave"
                name="idChave"
                type="text"
                placeholder="Identificação da chave. Ex: LAB-06"
                value={confirmationData.idChave}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-field-group">
              <label htmlFor="dataHoraEntrega" className="form-label">Data e hora de Entrega:</label>
              <input
                id="dataHoraEntrega"
                name="dataHoraEntrega"
                type="text"
                placeholder="dd/mm/aa - 00:00"
                value={confirmationData.dataHoraEntrega}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            <div className="button-group">
              <button
                type="button"
                className="form-button cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="form-button confirmar-button"
              >
                Confirmar
              </button>
            </div>

          </form>
        </section>

      </div>
    </div>
  );
}
