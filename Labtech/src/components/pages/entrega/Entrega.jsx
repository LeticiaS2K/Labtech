import React, { useState } from 'react';
import './entrega.css'

// Componente principal para a página de Entrega de Chaves
export default function Entrega() {
  // 1. Estado para gerir os dados do formulário
  const [formData, setFormData] = useState({
    professor: '',
    administrador: '',
    idChave: '',
    dataHora: '',
    finalidade: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // para registar a entrega da chave.
    console.log('Dados a serem confirmados:', formData);
    
    // Usando console.error em vez de alert() conforme as instruções do ambiente
    console.error('Entrega de chave registrada com sucesso (simulação).');
  };

  const handleCancel = () => {
    console.log('Operação de entrega cancelada.');
    // Poderia redirecionar o usuário ou limpar o formulário
    setFormData({
      professor: '',
      administrador: '',
      idChave: '',
      dataHora: '',
      finalidade: '',
    });
  };

  // 2. JSX para o formulário e a estrutura da página
  return (
    <div className="entrega-chaves-container">
    
      {/* Card do Formulário */}
      <div className="form-card">
        <h1 className="form-title">ENTREGA DE CHAVES</h1>
        <p className="form-subtitle">Entrega de chaves rápida e segura</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            
            {/* Campo Professor */}
            <div className="form-field-group">
              <label htmlFor="professor" className="form-label">Professor:</label>
              <input
                id="professor"
                name="professor"
                type="text"
                placeholder="Nome do professor"
                value={formData.professor}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Campo Administrador responsável */}
            <div className="form-field-group">
              <label htmlFor="administrador" className="form-label">Administrador responsável:</label>
              <input
                id="administrador"
                name="administrador"
                type="text"
                placeholder="Nome do Administrador"
                value={formData.administrador}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Campo ID Chave */}
            <div className="form-field-group">
              <label htmlFor="idChave" className="form-label">ID Chave:</label>
              <input
                id="idChave"
                name="idChave"
                type="text"
                placeholder="Identificação da chave. Ex: LAB-06"
                value={formData.idChave}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Campo Data e hora de retirada */}
            <div className="form-field-group">
              <label htmlFor="dataHora" className="form-label">Data e hora de retirada:</label>
              <input
                id="dataHora"
                name="dataHora"
                type="text"
                placeholder="dd/mm/aa - 00:00"
                value={formData.dataHora}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            {/* Campo Finalidade de uso (Full Width) */}
            <div className="form-field-group full-width-field">
              <label htmlFor="finalidade" className="form-label">Finalidade de uso:</label>
              <textarea
                id="finalidade"
                name="finalidade"
                placeholder="Escreva aqui"
                value={formData.finalidade}
                onChange={handleChange}
                className="form-textarea"
                required
              />
            </div>
          </div>

          {/* Botões de Ação */}
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
      </div>
    </div>
  );
}