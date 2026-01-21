import { useFormulario } from "../hooks/useFormulario";
import { useMemo } from "react";
import "../styles/app.css"

export function Formulario() {
  const { values, mensagem, handleChange, handleSubmit } = useFormulario();

  // Calcular se é menor de idade
  const ehMenorDeIdade = useMemo(() => {
    if (!values.dataNascimento) return false;
    const hoje = new Date();
    const nascimento = new Date(values.dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade < 18;
  }, [values.dataNascimento]);

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
                min-Length={11}
                maxLength={15}
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
                minLength={10}
                maxLength={14}
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
                maxLength={30}
                required
              />
            </div>

            {/* Seção de dados do responsável (se menor de 18 anos) */}
            {ehMenorDeIdade && (
              <>
                <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    Dados do Responsável
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#666" }}>
                    Como o candidato é menor de idade, precisamos dos dados do responsável legal.
                  </p>
                </div>

                <div className="field">
                  <label>Nome completo do responsável</label>
                  <input
                    name="responsavelNome"
                    placeholder="Digite o nome completo"
                    value={values.responsavelNome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="field">
                  <label>Grau de parentesco</label>
                  <div className="parentesco-selector">
                    <button
                      type="button"
                      className={`parentesco-option ${values.responsavelGrauParentesco === 'Pai' ? 'selected' : ''}`}
                      onClick={() => handleChange({ target: { name: 'responsavelGrauParentesco', value: 'Pai' } } as any)}
                    >
                      Pai
                    </button>
                    <button
                      type="button"
                      className={`parentesco-option ${values.responsavelGrauParentesco === 'Mãe' ? 'selected' : ''}`}
                      onClick={() => handleChange({ target: { name: 'responsavelGrauParentesco', value: 'Mãe' } } as any)}
                    >
                      Mãe
                    </button>
                    <button
                      type="button"
                      className={`parentesco-option ${values.responsavelGrauParentesco === 'Tutor(a)' ? 'selected' : ''}`}
                      onClick={() => handleChange({ target: { name: 'responsavelGrauParentesco', value: 'Tutor(a)' } } as any)}
                    >
                      Tutor(a)
                    </button>
                    <button
                      type="button"
                      className={`parentesco-option ${values.responsavelGrauParentesco === 'Avô/Avó' ? 'selected' : ''}`}
                      onClick={() => handleChange({ target: { name: 'responsavelGrauParentesco', value: 'Avô/Avó' } } as any)}
                    >
                      Avô/Avó
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label>WhatsApp do responsável</label>
                  <input
                    type="tel"
                    name="responsavelWhatsapp"
                    placeholder="(00) 00000-0000"
                    value={values.responsavelWhatsapp}
                    onChange={handleChange}
                    minLength={10}
                    maxLength={14}
                    required
                  />
                </div>

                <div className="field">
                  <label>CPF do responsável</label>
                  <input
                    name="responsavelCpf"
                    placeholder="000.000.000-00"
                    value={values.responsavelCpf}
                    onChange={handleChange}
                    minLength={11}
                    maxLength={15}
                    required
                  />
                </div>

                <div className="field">
                  <label>E-mail do responsável</label>
                  <input
                    type="email"
                    name="responsavelEmail"
                    placeholder="email@dominio.com"
                    value={values.responsavelEmail}
                    onChange={handleChange}
                    maxLength={30}
                    required
                  />
                </div>
              </>
            )}

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
