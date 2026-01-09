import { useFormulario } from "../hooks/useFormulario";

export function Formulario() {
  const { values, mensagem, handleChange, handleSubmit } = useFormulario();

  return (
    <header>
      <main className="page">
        <section className="hero">
          {/* Coluna esquerda (texto) */}
          <div>
            <h1>
              <span>Banco de Talentos</span>
              <br />
              Para os pais que querem o melhor futuro
            </h1>

            <p>
              Preencha os dados abaixo para reservar a vaga do seu filho(a) no
              processo seletivo do Programa Jovem Tech RP. Entramos em contato pelo
              WhatsApp ou e-mail para a próxima etapa.
            </p>

            <div className="badge">
              Dados protegidos e usados apenas para contato sobre o programa.
            </div>
          </div>

          {/* Coluna direita (formulário) */}
          <form className="form-card" onSubmit={handleSubmit}>
            <h2>Envie os dados do seu filho(a)</h2>
            <p>Responder leva menos de 1 minuto.</p>

            <div className="field">
              <label>Nome completo</label>
              <input
                name="nome"
                placeholder="Digite o nome completo"
                value={values.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>Data de nascimento</label>
              <input
                type="date"
                name="dataNascimento"
                value={values.dataNascimento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>CPF</label>
              <input
                name="cpf"
                placeholder="000.000.000-00"
                value={values.cpf}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>WhatsApp</label>
              <input
                type="tel"
                name="whatsapp"
                placeholder="(00) 00000-0000"
                value={values.whatsapp}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                placeholder="seuemail@dominio.com"
                value={values.email}
                onChange={handleChange}
                required
              />
            </div>

            {mensagem && (
              <p className={`form-message ${mensagem.tipo}`}>
                {mensagem.texto}
              </p>
            )}



            <button type="submit" className="cta">
              Quero participar
            </button>

            <p className="small-note">
              Ao enviar, você concorda em receber nosso contato sobre as etapas do
              Programa Jovem Tech RP.
            </p>
          </form>
        </section>
      </main>
    </header>
  );
}
