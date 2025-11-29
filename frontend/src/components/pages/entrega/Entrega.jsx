import "./entrega.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function Entrega() {
  const navigate = useNavigate();

  const [chaves, setChaves] = useState([]);
  const [loadingChaves, setLoadingChaves] = useState(true);

  const [chaveId, setChaveId] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [contato, setContato] = useState("");
  const [destino, setDestino] = useState("");
  const [observacao, setObservacao] = useState("");

  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // carrega apenas chaves disponíveis
  useEffect(() => {
    const fetchChaves = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/chaves?disponivel=true`,
          { credentials: "include" }       // ✅ mantém
        );
        const data = await res.json();
        setChaves(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar as chaves disponíveis.");
      } finally {
        setLoadingChaves(false);
      }
    };

    fetchChaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!chaveId || !responsavel) {
      setError("Selecione uma chave e informe o responsável.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/entregas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",        
      body: JSON.stringify({
        chave_id: Number(chaveId),
        responsavel,
        contato,
        destino,
        observacao,
      }),
    });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erro ao registrar entrega.");
      }

      setSuccess("Entrega registrada com sucesso.");
      // limpa só alguns campos
      setChaveId("");
      setDestino("");
      setObservacao("");
      // recarrega chaves disponíveis
      const res2 = await fetch(
        `${API_URL}/api/chaves?disponivel=true`,
        { credentials: "include" }
      );
      setChaves(await res2.json());
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleCancel = () => {
    navigate("/chaves");
  };

  return (
    <div className="entrega-page">
      <section className="entrega-card">
        <header className="entrega-header">
          <h2>Entrega de chave</h2>
          <p>Selecione uma chave disponível e registre para quem está sendo entregue.</p>
        </header>

        <form className="entrega-form" onSubmit={handleSubmit}>
          <div className="entrega-form__row">
            <div className="entrega-form__group">
              <label htmlFor="chave">Chave</label>
              {loadingChaves ? (
                <p>Carregando chaves...</p>
              ) : (
                <select
                  id="chave"
                  value={chaveId}
                  onChange={(e) => setChaveId(e.target.value)}
                >
                  <option value="">Selecione uma chave</option>
                  {chaves.map((chave) => (
                    <option key={chave.id} value={chave.id}>
                      {chave.identificacao} - {chave.descricao}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="entrega-form__group">
              <label htmlFor="responsavel">Responsável</label>
              <input
                id="responsavel"
                type="text"
                placeholder="Nome de quem está levando a chave"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
            </div>
          </div>

          <div className="entrega-form__row">
            <div className="entrega-form__group">
              <label htmlFor="contato">Contato (tel./e-mail)</label>
              <input
                id="contato"
                type="text"
                placeholder="(61) 9 9999-9999 / email"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
              />
            </div>

            <div className="entrega-form__group">
              <label htmlFor="destino">Destino</label>
              <input
                id="destino"
                type="text"
                placeholder="Laboratório, sala, setor..."
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
              />
            </div>
          </div>

          <div className="entrega-form__group">
            <label htmlFor="observacao">Observações</label>
            <textarea
              id="observacao"
              placeholder="Observações adicionais (opcional)"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </div>

          {error && <p className="entrega-error">{error}</p>}
          {success && <p className="entrega-success">{success}</p>}

          <div className="entrega-actions">
            <button
              type="button"
              className="entrega-btn entrega-btn--ghost"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="entrega-btn entrega-btn--primary"
              disabled={sending}
            >
              {sending ? "Registrando..." : "Registrar entrega"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
