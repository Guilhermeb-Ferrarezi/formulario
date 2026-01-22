import { useFormulario } from "../hooks/useFormulario";
import { useMemo, useState } from "react";
import "../styles/app.css"

interface Responsavel {
  nome: string;
  grauParentesco: string;
  whatsapp: string;
  cpf: string;
  email: string;
  rua: string;
  numero: string;
  bairro: string;
}

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

  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([
    {
      nome: "",
      grauParentesco: "",
      whatsapp: "",
      cpf: "",
      email: "",
      rua: "",
      numero: "",
      bairro: "",
    },
  ]);
  const [responsavelAtivo, setResponsavelAtivo] = useState<number>(0);

  const handleResponsavelChange = (field: keyof Responsavel, value: string) => {
    const novasResponsaveis = [...responsaveis];
    novasResponsaveis[responsavelAtivo] = {
      ...novasResponsaveis[responsavelAtivo],
      [field]: value,
    };
    setResponsaveis(novasResponsaveis);
  };

  const handleAdicionarResponsavel = () => {
    const novoResponsavel: Responsavel = {
      nome: "",
      grauParentesco: "",
      whatsapp: "",
      cpf: "",
      email: "",
      rua: "",
      numero: "",
      bairro: "",
    };
    setResponsaveis([...responsaveis, novoResponsavel]);
    setResponsavelAtivo(responsaveis.length);
  };

  const handleRemoverResponsavel = (index: number) => {
    if (responsaveis.length === 1) {
      alert("Você precisa ter pelo menos um responsável");
      return;
    }
    const novasResponsaveis = responsaveis.filter((_, i) => i !== index);
    setResponsaveis(novasResponsaveis);
    // Se removeu o ativo, volta ao anterior
    if (responsavelAtivo >= novasResponsaveis.length) {
      setResponsavelAtivo(novasResponsaveis.length - 1);
    }
  };

  const handleSubmitComResponsaveis = (e: React.FormEvent) => {
    e.preventDefault();
    const submitHandler = handleSubmit as any;
    submitHandler(e, ehMenorDeIdade ? responsaveis : null);
  };

  const responsavelAtualizado = responsaveis[responsavelAtivo] || {
    nome: "",
    grauParentesco: "",
    whatsapp: "",
    cpf: "",
    email: "",
    rua: "",
    numero: "",
    bairro: "",
  };

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
          <form className="form-card" onSubmit={handleSubmitComResponsaveis}>
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
                minLength={11}
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
                <div className="responsavel-section-header">
                  <h3 className="responsavel-title">
                    Dados do Responsável
                  </h3>
                  <p className="responsavel-description">
                    Como o candidato é menor de idade, precisamos dos dados do responsável legal.
                  </p>
                </div>

                {responsaveis.length > 0 && (
                  <div className="responsavel-selector">
                    {responsaveis.map((_, index) => (
                      <div key={index} className="responsavel-tab-wrapper">
                        <button
                          type="button"
                          className={`responsavel-tab ${responsavelAtivo === index ? 'active' : ''}`}
                          onClick={() => setResponsavelAtivo(index)}
                        >
                          {index + 1}
                        </button>
                        {responsaveis.length > 1 && (
                          <button
                            type="button"
                            className="responsavel-remove-btn"
                            onClick={() => handleRemoverResponsavel(index)}
                            title="Remover responsável"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="responsavel-add-btn"
                      onClick={handleAdicionarResponsavel}
                    >
                      +
                    </button>
                  </div>
                )}

                <div className="field">
                  <label>Nome completo do responsável</label>
                  <input
                    name="nome"
                    placeholder="Digite o nome completo"
                    value={responsavelAtualizado.nome}
                    onChange={(e) => handleResponsavelChange("nome", e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Grau de parentesco</label>
                  <div className="parentesco-selector">
                    <button
                      type="button"
                      className={`parentesco-option ${responsavelAtualizado.grauParentesco === 'Pai' ? 'selected' : ''}`}
                      onClick={() => handleResponsavelChange('grauParentesco', 'Pai')}
                    >
                      Pai
                    </button>
                    <button
                      type="button"
                      className={`parentesco-option ${responsavelAtualizado.grauParentesco === 'Mãe' ? 'selected' : ''}`}
                      onClick={() => handleResponsavelChange('grauParentesco', 'Mãe')}
                    >
                      Mãe
                    </button>
                    <button
                      type="button"
                      className={`parentesco-option ${responsavelAtualizado.grauParentesco === 'Tutor(a)' ? 'selected' : ''}`}
                      onClick={() => handleResponsavelChange('grauParentesco', 'Tutor(a)')}
                    >
                      Tutor(a)
                    </button>
                    <button
                      type="button"
                      className={`parentesco-option ${responsavelAtualizado.grauParentesco === 'Avô/Avó' ? 'selected' : ''}`}
                      onClick={() => handleResponsavelChange('grauParentesco', 'Avô/Avó')}
                    >
                      Avô/Avó
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label>WhatsApp do responsável</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="(00) 00000-0000"
                    value={responsavelAtualizado.whatsapp}
                    onChange={(e) => handleResponsavelChange("whatsapp", e.target.value)}
                    minLength={10}
                    maxLength={14}
                    required
                  />
                </div>

                <div className="field">
                  <label>CPF do responsável</label>
                  <input
                    name="cpf"
                    placeholder="000.000.000-00"
                    value={responsavelAtualizado.cpf}
                    onChange={(e) => handleResponsavelChange("cpf", e.target.value)}
                    minLength={11}
                    maxLength={15}
                    required
                  />
                </div>

                <div className="field">
                  <label>E-mail do responsável</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@dominio.com"
                    value={responsavelAtualizado.email}
                    onChange={(e) => handleResponsavelChange("email", e.target.value)}
                    maxLength={30}
                    required
                  />
                </div>

                <div className="responsavel-endereco-title">
                  <h4>Endereço do Responsável</h4>
                </div>

                <div className="field">
                  <label>Rua</label>
                  <input
                    name="rua"
                    placeholder="Nome da rua"
                    value={responsavelAtualizado.rua}
                    onChange={(e) => handleResponsavelChange("rua", e.target.value)}
                    required
                  />
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>Número</label>
                    <input
                      name="numero"
                      placeholder="Ex: 123"
                      value={responsavelAtualizado.numero}
                      onChange={(e) => handleResponsavelChange("numero", e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Bairro</label>
                    <input
                      name="bairro"
                      placeholder="Nome do bairro"
                      value={responsavelAtualizado.bairro}
                      onChange={(e) => handleResponsavelChange("bairro", e.target.value)}
                      required
                    />
                  </div>
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
