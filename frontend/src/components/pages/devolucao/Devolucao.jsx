import "./devolucao.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function Devolucao() {
  const navigate = useNavigate();

  const [entregas, setEntregas] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // entrega selecionada (detalhes do lado esquerdo)
  const selectedEntrega =
    entregas.find((e) => e.id === Number(selectedId)) || null;

  const carregarEntregas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/api/entregas?abertas=true`,
        { credentials: "include" }
      );
      const data = await res.json();
      setEntregas(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar chaves entregues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEntregas();
  }, []);

  const handleDevolver = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedId) {
      setError("Selecione uma chave entregue para devolver.");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(
        `${API_URL}/api/entregas/${selectedId}/devolver`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erro ao registrar devolução.");
      }

      setSuccess("Devolução registrada com sucesso.");
      setSelectedId("");
      await carregarEntregas();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate("/chaves");
  };

  return (
    <div className="devolucao-chaves-container">
      {/* Título principal */}
      <header className="title-section">
        <h1 className="main-title">Devolução de chaves</h1>
        <p className="main-subtitle">
          Selecione uma chave entregue e confirme a devolução.
        </p>
      </header>

      {loading ? (
        <p>Carregando chaves entregues...</p>
      ) : entregas.length === 0 ? (
        <p>Não há chaves pendentes de devolução.</p>
      ) : (
        <div className="main-content-grid">
          {/* LADO ESQUERDO – DETALHES DO EMPRÉSTIMO */}
          <section className="loan-details-card">
            <div className="detail-item-group">
              <span className="detail-label">Chave</span>
              <span className="detail-value">
                {selectedEntrega
                  ? selectedEntrega.chave_identificacao
                  : "Selecione uma chave ao lado"}
              </span>
            </div>

            <div className="detail-item-group">
              <span className="detail-label">Responsável</span>
              <span className="detail-value">
                {selectedEntrega ? selectedEntrega.responsavel : "—"}
              </span>
            </div>

            <div className="detail-item-group">
              <span className="detail-label">Contato</span>
              <span className="detail-value">
                {selectedEntrega ? selectedEntrega.contato || "—" : "—"}
              </span>
            </div>

            <div className="detail-item-group">
              <span className="detail-label">Destino</span>
              <span className="detail-value">
                {selectedEntrega ? selectedEntrega.destino || "—" : "—"}
              </span>
            </div>

            <div className="detail-item-group">
              <span className="detail-label">Entregue em</span>
              <span className="detail-value">
                {selectedEntrega?.data_hora_entrega
                  ? new Date(
                      selectedEntrega.data_hora_entrega
                    ).toLocaleString("pt-BR")
                  : "—"}
              </span>
            </div>

            <div className="detail-item-group">
              <span className="detail-label">Observações</span>
              <span className="detail-value">
                {selectedEntrega ? selectedEntrega.observacao || "—" : "—"}
              </span>
            </div>
          </section>

          {/* LADO DIREITO – CONFIRMAÇÃO DE DEVOLUÇÃO */}
          <section className="confirmation-card">
            <h2 className="confirmation-title">Confirmar devolução</h2>

            <form className="confirmation-form" onSubmit={handleDevolver}>
              <div className="form-field-group">
                <label className="form-label" htmlFor="chave-select">
                  Chave entregue
                </label>
                <select
                  id="chave-select"
                  className="form-input"
                  value={selectedId}
                  onChange={(e) => {
                    setSelectedId(e.target.value);
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  <option value="">Selecione uma chave</option>
                  {entregas.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.chave_identificacao} — {e.responsavel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Se quiser algum campo extra (ex: conferente), dá pra colocar aqui */}

              {error && <p className="devolucao-error">{error}</p>}
              {success && <p className="devolucao-success">{success}</p>}

              <div className="button-group">
                <button
                  type="button"
                  className="form-button cancel-button"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="form-button confirmar-button"
                  disabled={processing}
                >
                  {processing ? "Devolvendo..." : "Confirmar devolução"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
