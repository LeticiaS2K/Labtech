// src/components/pages/Profile.jsx
import "./profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();

    const handleCancel = () => {
      navigate("/", { replace: true }); // vai para Home
    };

  return (
    <div className="profile-page">
      <section className="profile-card">
        {/* COLUNA ESQUERDA – FOTO + INFO BÁSICA */}
        <div className="profile-card__left">
          <div className="profile-avatar">
            <span>U</span>
          </div>

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
                <input
                  id="nome"
                  type="text"
                  placeholder="Nome do usuário"
                />
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
                <button type="button" className="profile-btn profile-btn--ghost" onClick={handleCancel}>
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