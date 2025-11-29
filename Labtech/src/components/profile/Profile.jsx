// src/components/pages/Profile.jsx
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Profile() {
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(null);

  const handleCancel = () => {
    navigate("/", { replace: true });
  };

  // ✅ Carrega foto salva ao abrir o profile
  useEffect(() => {
    const savedAvatar = localStorage.getItem("profileAvatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  // ✅ Quando selecionar uma nova imagem
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      localStorage.setItem("profileAvatar", reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-page">
      <section className="profile-card">

        {/* COLUNA ESQUERDA – FOTO + INFO BÁSICA */}
        <div className="profile-card__left">

          {/* ✅ A BOLA DE PERFIL */}
          <div className="profile-avatar">
            {avatar ? (
              <img src={avatar} alt="Foto de perfil" />
            ) : (
              <span>U</span>
            )}
          </div>

          {/* ✅ AGORA O ALTERAR FOTO FICA EMBAIXO */}
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
            <h2 className="profile-name">Usuário UDF</h2>
            <span className="profile-role">Administrador</span>

            <div className="profile-badges">
              <span className="profile-badge">UDF</span>
              <span className="profile-badge profile-badge--light">
                Id: 000123
              </span>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA – FORM */}
        <div className="profile-card__right">
          <h3 className="profile-section-title">Dados pessoais</h3>

          <form className="profile-form">
            <div className="profile-form__row">
              <div className="profile-form__group">
                <label htmlFor="nome">Nome completo</label>
                <input id="nome" type="text" placeholder="Nome do usuário" />
              </div>

              <div className="profile-form__group">
                <label htmlFor="email">E-mail institucional</label>
                <input
                  id="email"
                  type="email"
                  placeholder="usuario@udf.edu.br"
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
                />
              </div>

              <div className="profile-form__group">
                <label htmlFor="curso">Curso / Departamento</label>
                <input
                  id="curso"
                  type="text"
                  placeholder="Engenharia / TI"
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
                />
              </div>

              <div className="profile-form__group">
                <label htmlFor="nova-senha">Nova senha</label>
                <input
                  id="nova-senha"
                  type="password"
                  placeholder="********"
                />
              </div>
            </div>

            <div className="profile-actions">
              <button
                type="button"
                className="profile-btn profile-btn--ghost"
                onClick={handleCancel}
              >
                Cancelar
              </button>

              <button type="submit" className="profile-btn profile-btn--primary">
                Salvar alterações
              </button>
            </div>
          </form>
        </div>

      </section>
    </div>
  );
}
