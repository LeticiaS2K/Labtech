// src/components/pages/Profile.jsx
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

// Formata telefone no padrão brasileiro: (61) 9 9999-9999
function formatTelefone(value) {
  // tira tudo que não é dígito e limita a 11 dígitos
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 3) {
    // (61) 9
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 7) {
    // (61) 9 9999
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
  }

  // 8 a 11 dígitos: (61) 9 9999-9999
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(
    3,
    7
  )}-${digits.slice(7)}`;
}

// Deixa o e-mail sempre minúsculo e sem espaços
function formatEmail(value) {
  return value.replace(/\s/g, "").toLowerCase();
}

export default function Profile({ user, onUserChange }) {
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState(null);

  // campos do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  // esses dois ficam só no front por enquanto (sem coluna no banco)
  const [telefone, setTelefone] = useState("");
  const [curso, setCurso] = useState("");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleTelefoneChange = (e) => {
    const value = e.target.value;
    const formatted = formatTelefone(value);
    setTelefone(formatted);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const formatted = formatEmail(value);
    setEmail(formatted);
  };


  const handleCancel = () => {
    navigate("/", { replace: true });
  };

  // carrega dados do usuário e foto ao abrir/atualizar user
  useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setEmail(user.email || "");
    }

    if (user?.id && user?.has_photo) {
      setAvatarUrl(`${API_URL}/api/users/${user.id}/photo?${Date.now()}`);
    } else {
      setAvatarUrl(null);
    }
  }, [user]);

  // === FOTO DE PERFIL (o MESMO handleAvatarChange que você mandou) ===
  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !user?.id) return;

    const formData = new FormData();
    formData.append("foto", file);

    try {
      const res = await fetch(`${API_URL}/api/users/me/photo`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Erro ao enviar foto.");
      }

      // Atualiza o user no estado global (App) e no localStorage
      const updatedUser = { ...(user || {}), has_photo: true };
      if (typeof onUserChange === "function") {
        onUserChange(updatedUser);
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // força o refresh da URL da imagem (bypass cache)
      setAvatarUrl(
        `${API_URL}/api/users/${user.id}/photo?${Date.now()}`
      );
    } catch (err) {
      console.error(err);
      setError("Erro ao enviar foto de perfil.");
    }
  };

  // === SALVAR ALTERAÇÕES DE NOME / E-MAIL / SENHA ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nome,
          email,
          senha_atual: senhaAtual || null,
          nova_senha: novaSenha || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erro ao salvar dados.");
      }

      // atualiza user global + localStorage
      if (typeof onUserChange === "function") {
        onUserChange(data.user);
      }
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Dados atualizados com sucesso.");
      setSenhaAtual("");
      setNovaSenha("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initialLetter =
    nome?.trim()?.charAt(0)?.toUpperCase() ||
    user?.nome?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="profile-page">
      <section className="profile-card">
        {/* COLUNA ESQUERDA – FOTO + INFO BÁSICA */}
        <div className="profile-card__left">
          <div className="profile-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Foto de perfil" />
            ) : (
              <span>{initialLetter}</span>
            )}
          </div>

          <label className="profile-avatar-upload">
            Alterar foto
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </label>

          <div className="profile-main-info">
            <h2 className="profile-name">{nome || "Usuário UDF"}</h2>
            <span className="profile-role">
              {email || "usuario@udf.edu.br"}
            </span>

            <div className="profile-badges">
              <span className="profile-badge">UDF</span>
              {user?.id && (
                <span className="profile-badge profile-badge--light">
                  Id: {String(user.id).padStart(6, "0")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA – FORM */}
        <div className="profile-card__right">
          <h3 className="profile-section-title">Dados pessoais</h3>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-form__row">
              <div className="profile-form__group">
                <label htmlFor="nome">Nome completo</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Nome do usuário"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="profile-form__group">
                <label htmlFor="email">E-mail institucional</label>
                <input
                  id="email"
                  type="email"
                  placeholder="usuario@udf.edu.br"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>

            <div className="profile-form__row">
              <div className="profile-form__group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  id="telefone"
                  type="tel"
                  placeholder="(61) 9 9999-9999"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  maxLength={20} // só pra não crescer demais visualmente
                />
              </div>

              <div className="profile-form__group">
                <label htmlFor="curso">Curso / Departamento</label>
                <input
                  id="curso"
                  type="text"
                  placeholder="Engenharia / TI"
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                />
              </div>
            </div>

            <h3 className="profile-section-title">Segurança</h3>

            <div className="profile-form__row">
              <div className="profile-form__group">
                <label htmlFor="senha-atual">Senha atual</label>
                <input
                  id="senha-atual"
                  type="password"
                  placeholder="********"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
              </div>

              <div className="profile-form__group">
                <label htmlFor="nova-senha">Nova senha</label>
                <input
                  id="nova-senha"
                  type="password"
                  placeholder="********"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>
            </div>

            {/* mensagens de erro/sucesso */}
            {error && <p className="profile-error">{error}</p>}
            {success && <p className="profile-success">{success}</p>}

            <div className="profile-actions">
              <button
                type="button"
                className="profile-btn profile-btn--ghost"
                onClick={handleCancel}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="profile-btn profile-btn--primary"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
