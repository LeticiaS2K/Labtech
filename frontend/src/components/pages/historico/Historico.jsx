// src/components/pages/historico/Historico.jsx
import { useEffect, useState } from "react";
import { API_URL } from "../../../config/api";
import "./historico.css";

// IMPORTAÇÃO DOS COMPONENTES
import Sidebar from "../../Sidebar/Sidebar";
import Header from "../../header/Header";
import Cards from "../../cards/Cards"; 

export default function Historico() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  // Dados do Usuário para a Sidebar
  const userMock = JSON.parse(localStorage.getItem("user")) || { nome: "Admin", id: 1 };

  useEffect(() => {
    async function loadHistorico() {
      setLoading(true);
      setErro(null);
      try {
        const res = await fetch(`${API_URL}/api/historico`, { credentials: "include" });
        const data = await res.json().catch(() => null);

        if (!res.ok || !data) throw new Error(data?.message || "Erro ao carregar dados.");

        if (data.items) setItems(data.items);
        else if (Array.isArray(data)) setItems(data);
        else setItems([]);
      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar o histórico.");
      } finally {
        setLoading(false);
      }
    }
    loadHistorico();
  }, []);

  const handleExport = () => {
    window.open(`${API_URL}/api/historico/export`, "_blank");
  };

  // Formatação de data legível
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return (
    <div className="historico-page">

      {/* 2. ÁREA DE CONTEÚDO */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        

        <div className="historico-page-container">
          
          {/* WRAPPER CENTRALIZADOR (Simula a Home) */}
          <div className="historico-center-wrapper">
            
            {/* CARDS AZUUIS (TRAVADOS PELO CSS) */}
            <Cards />

            <div className="historico-section">
              

              {loading && <p className="loading-msg">Carregando registros...</p>}
              {erro && <p className="error-msg">{erro}</p>}

              {/* TABELA COM CONTAINER DE SCROLL HORIZONTAL */}
              {!loading && !erro && (
                <div className="historico-table-wrapper">
                  <table className="historico-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Chave</th>
                        <th>Tipo / Descrição</th>
                        <th>Destino</th>
                        <th>Responsável</th>
                        <th>Contato</th>
                        <th style={{ textAlign: 'center' }}>Status</th>
                        <th>Data Entrega</th>
                        <th>Data Devolução</th>
                        <th className="obs-col">Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                            Nenhum histórico encontrado.
                          </td>
                        </tr>
                      ) : (
                        items.map((item) => (
                          <tr key={item.id}>
                            <td>#{item.id}</td>
                            <td>{item.chave_identificacao || "-"}</td>
                            <td>{item.tipo_sala || "Sala"}</td>
                            <td>{item.destino || "-"}</td>
                            <td style={{ fontWeight: 600 }}>{item.responsavel}</td>
                            <td>{item.contato}</td>
                            
                            {/* --- COLUNA DE STATUS COM PÍLULAS COLORIDAS --- */}
                            <td style={{ textAlign: 'center' }}>
                              <span 
                                className={`status-badge status-badge--${(item.status || "pendente").toLowerCase().trim()}`}
                              >
                                {item.status}
                              </span>
                            </td>

                            <td>{formatDate(item.data_hora_entrega)}</td>
                            <td>{formatDate(item.data_hora_devolucao)}</td>
                            
                            {/* COLUNA DE OBSERVAÇÃO (Larga via CSS) */}
                            <td className="obs-text">
                              {item.observacao ? item.observacao : "—"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  
                </div>
                
              )}
              <div className="historico-header-actions">
                    <button className="historico-export-btn" onClick={handleExport}>
                      Exportar CSV
                    </button>
              </div>  
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}