// src/components/pages/ajuda.jsx
import "./ajuda.css";

export default function ajuda() {
  return (
    <div className="ajuda-page">
      {/* TÍTULO / DESCRIÇÃO */}
      <header className="ajuda-header">
        <div>
          <h1 className="ajuda-title">Ajuda &amp; Suporte</h1>
          <p className="ajuda-subtitle">
            Encontre respostas rápidas sobre reservas de salas, chaves e uso da
            plataforma UDF.
          </p>
        </div>
      </header>

      <section className="ajuda-grid">
        {/* BLOCO PRINCIPAL – TÓPICOS DE AJUDA */}
        <article className="ajuda-panel ajuda-panel--main">
          <h2 className="ajuda-panel__title">Principais tópicos</h2>

          <div className="ajuda-topics">
            <div className="ajuda-topic">
              <h3 className="ajuda-topic__title">Como reservar uma sala?</h3>
              <p className="ajuda-topic__text">
                Acesse o menu <strong>“Salas e Reservas”</strong>, escolha o
                laboratório ou sala desejada, selecione o horário disponível e
                confirme a reserva. Você poderá acompanhar a situação na tela
                inicial.
              </p>
            </div>

            <div className="ajuda-topic">
              <h3 className="ajuda-topic__title">
                Problemas com entrega / devolução de chaves
              </h3>
              <p className="ajuda-topic__text">
                Use o módulo <strong>“Entrega e Recebimento de chaves”</strong>{" "}
                para registrar retirada e devolução. Caso o status apareça como{" "}
                <span className="ajuda-badge ajuda-badge--danger">PENDENTE</span>,
                procure a coordenação ou o suporte da UDF.
              </p>
            </div>

            <div className="ajuda-topic">
              <h3 className="ajuda-topic__title">Atualização de cadastro</h3>
              <p className="ajuda-topic__text">
                Na página <strong>“Perfil”</strong> você pode alterar seus dados
                pessoais e atualizar sua senha de acesso à plataforma.
              </p>
            </div>
          </div>
        </article>

        {/* COLUNA LATERAL – CONTATO + FAQ RÁPIDO */}
        <div className="ajuda-side">
          {/* CONTATO */}
          <article className="ajuda-panel">
            <h2 className="ajuda-panel__title ajuda-panel__title--center">
              Suporte UDF
            </h2>

            <div className="ajuda-contact">
              <div className="ajuda-contact__item">
                <span className="ajuda-contact__label">E-mail:</span>
                <span className="ajuda-contact__value">
                  suporte@udf.edu.br
                </span>
              </div>
              <div className="ajuda-contact__item">
                <span className="ajuda-contact__label">Telefone:</span>
                <span className="ajuda-contact__value">
                  (61) 0000-0000
                </span>
              </div>
              <div className="ajuda-contact__item">
                <span className="ajuda-contact__label">Horário:</span>
                <span className="ajuda-contact__value">
                  Seg a Sex • 08h às 22h
                </span>
              </div>
            </div>

            <button className="ajuda-btn">
              Abrir chamado de suporte
            </button>
          </article>

          {/* FAQ RÁPIDO */}
          <article className="ajuda-panel">
            <h2 className="ajuda-panel__title ajuda-panel__title--center">
              FAQ rápido
            </h2>

            <ul className="ajuda-faq">
              <li className="ajuda-faq__item">
                <h4>Minha reserva não apareceu na Home</h4>
                <p>
                  Aguarde alguns instantes e atualize a página. Se o problema
                  persistir, verifique se você confirmou a reserva até o final
                  do fluxo.
                </p>
              </li>
              <li className="ajuda-faq__item">
                <h4>Não consigo devolver a chave no sistema</h4>
                <p>
                  Confira se a chave está vinculada ao seu usuário. Caso esteja
                  com outro professor, solicite que ele faça a devolução ou
                  entre em contato com o suporte.
                </p>
              </li>
              <li className="ajuda-faq__item">
                <h4>Esqueci minha senha</h4>
                <p>
                  Use a opção <strong>“Esqueci minha senha”</strong> na tela de
                  login ou procure o suporte da UDF para redefini-la.
                </p>
              </li>
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}