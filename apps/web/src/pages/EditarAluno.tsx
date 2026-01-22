import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/editar.css";

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

interface Aluno {
  id: number;
  nome: string;
  data_nascimento: string;
  whatsapp: string;
  email: string;
  cpf: string;
  responsaveis?: Responsavel[];
}

export default function EditarAluno() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [responsavelAtivo, setResponsavelAtivo] = useState<number>(0);
  const [mensagem, setMensagem] = useState<{
  texto: string;
  tipo: "sucesso" | "erro";
    } | null>(null);

  const [carregando, setCarregando] = useState(true);

  // Calcular se é menor de idade
  const ehMenorDeIdade = (() => {
    if (!aluno?.data_nascimento) return false;
    const hoje = new Date();
    const nascimento = new Date(aluno.data_nascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade < 18;
  })();

  // ======================
  // BUSCAR ALUNO PELO ID
  // ======================
  useEffect(() => {
    buscarAluno();
  }, []);

  const buscarAluno = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://api.santos-tech.com/api/alunos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setMensagem({
            texto: "Erro ao buscar dados do aluno",
            tipo: "erro",
        })
        return;
      }

      const data = await response.json();
      setAluno(data);

      // Carregar responsáveis
      if (data.responsaveis && Array.isArray(data.responsaveis) && data.responsaveis.length > 0) {
        setResponsaveis(data.responsaveis);
      } else {
        setResponsaveis([{
          nome: "",
          grauParentesco: "",
          whatsapp: "",
          cpf: "",
          email: "",
          rua: "",
          numero: "",
          bairro: "",
        }]);
      }
    } catch (error) {
      console.error(error);
      setMensagem({
        texto: "Erro ao conectar com o servidor",
        tipo: "erro",
      });
    } finally {
      setCarregando(false);
    }
  };

  // ======================
  // ATUALIZAR CAMPOS DO ALUNO
  // ======================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!aluno) return;

    const { name, value } = e.target;
    setAluno({ ...aluno, [name]: value });
  };

  // ======================
  // ATUALIZAR RESPONSÁVEL
  // ======================
  const handleResponsavelChange = (field: keyof Responsavel, value: string) => {
    const novasResponsaveis = [...responsaveis];
    novasResponsaveis[responsavelAtivo] = {
      ...novasResponsaveis[responsavelAtivo],
      [field]: value,
    };
    setResponsaveis(novasResponsaveis);
  };

  // ======================
  // ADICIONAR RESPONSÁVEL
  // ======================
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

  // ======================
  // SALVAR ALTERAÇÕES
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!aluno) return;

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...aluno,
        responsaveis: responsaveis || [],
      };

      const response = await fetch(
        `https://api.santos-tech.com/api/alunos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMensagem({
          texto: data.erro || "Erro ao atualizar aluno",
          tipo: "erro",
        });
        return;
      }

      setMensagem({
        texto: "Aluno e responsáveis atualizados com sucesso!",
        tipo: "sucesso",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error(error);
      setMensagem({
        texto: "Erro ao conectar com o servidor",
        tipo: "erro",
      });
    }
  };

  if (carregando) {
    return (
      <div className="editar-page">
        <div className="editar-container">
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Carregando dados do aluno...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="editar-page">
        <div className="editar-container">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h2>Aluno não encontrado</h2>
            <button className="botao-cancelar" onClick={() => navigate("/dashboard")}>
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editar-page">
      <div className="editar-container">
        <div className="editar-header">
          <h1>✏️ Editar Aluno</h1>
          <p>Atualize as informações do aluno cadastrado</p>
        </div>

        {mensagem && (
          <div className={`editar-message ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        <form className="editar-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>📋 Dados Pessoais</h3>

            <div className="field">
              <label>Nome completo</label>
              <input
                name="nome"
                value={aluno.nome}
                onChange={handleChange}
                placeholder="Nome completo do aluno"
                required
              />
            </div>

            <div className="field">
              <label>Data de nascimento</label>
              <input
                type="date"
                name="data_nascimento"
                value={aluno.data_nascimento.split("T")[0]}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label>CPF</label>
              <input
                name="cpf"
                value={aluno.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>📞 Contato</h3>

            <div className="field">
              <label>WhatsApp</label>
              <input
                name="whatsapp"
                value={aluno.whatsapp}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="field">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                value={aluno.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
                required
              />
            </div>
          </div>

          {/* Seção de dados dos responsáveis */}
          {responsaveis.length > 0 && (
            <div className="form-section responsavel-section">
              <div className="responsavel-section-header">
                <h3 className="responsavel-title">👤 Dados dos Responsáveis</h3>
                <p className="responsavel-description">
                  {ehMenorDeIdade
                    ? "Como o candidato é menor de idade, os dados do responsável são obrigatórios."
                    : "Adicione dados do responsável (opcional)."}
                </p>
              </div>

              <div className="responsavel-selector">
                {responsaveis.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`responsavel-tab ${responsavelAtivo === index ? 'active' : ''}`}
                    onClick={() => setResponsavelAtivo(index)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  type="button"
                  className="responsavel-add-btn"
                  onClick={handleAdicionarResponsavel}
                >
                  +
                </button>
              </div>

              {responsaveis[responsavelAtivo] && (
                <>
                  <div className="field">
                    <label>Nome completo do responsável</label>
                    <input
                      name="nome"
                      value={responsaveis[responsavelAtivo].nome}
                      onChange={(e) => handleResponsavelChange("nome", e.target.value)}
                      placeholder="Nome completo do responsável"
                      required={ehMenorDeIdade}
                    />
                  </div>

                  <div className="field">
                    <label>Grau de parentesco</label>
                    <div className="parentesco-selector">
                      <button
                        type="button"
                        className={`parentesco-option ${responsaveis[responsavelAtivo].grauParentesco === 'Pai' ? 'selected' : ''}`}
                        onClick={() => handleResponsavelChange('grauParentesco', 'Pai')}
                      >
                        👨 Pai
                      </button>
                      <button
                        type="button"
                        className={`parentesco-option ${responsaveis[responsavelAtivo].grauParentesco === 'Mãe' ? 'selected' : ''}`}
                        onClick={() => handleResponsavelChange('grauParentesco', 'Mãe')}
                      >
                        👩 Mãe
                      </button>
                      <button
                        type="button"
                        className={`parentesco-option ${responsaveis[responsavelAtivo].grauParentesco === 'Tutor(a)' ? 'selected' : ''}`}
                        onClick={() => handleResponsavelChange('grauParentesco', 'Tutor(a)')}
                      >
                        👤 Tutor(a)
                      </button>
                      <button
                        type="button"
                        className={`parentesco-option ${responsaveis[responsavelAtivo].grauParentesco === 'Avô/Avó' ? 'selected' : ''}`}
                        onClick={() => handleResponsavelChange('grauParentesco', 'Avô/Avó')}
                      >
                        👴 Avô/Avó
                      </button>
                    </div>
                  </div>

                  <div className="field">
                    <label>WhatsApp do responsável</label>
                    <input
                      name="whatsapp"
                      value={responsaveis[responsavelAtivo].whatsapp}
                      onChange={(e) => handleResponsavelChange("whatsapp", e.target.value)}
                      placeholder="(00) 00000-0000"
                      required={ehMenorDeIdade}
                    />
                  </div>

                  <div className="field">
                    <label>CPF do responsável</label>
                    <input
                      name="cpf"
                      value={responsaveis[responsavelAtivo].cpf}
                      onChange={(e) => handleResponsavelChange("cpf", e.target.value)}
                      placeholder="000.000.000-00"
                      required={ehMenorDeIdade}
                    />
                  </div>

                  <div className="field">
                    <label>E-mail do responsável</label>
                    <input
                      type="email"
                      name="email"
                      value={responsaveis[responsavelAtivo].email}
                      onChange={(e) => handleResponsavelChange("email", e.target.value)}
                      placeholder="email@exemplo.com"
                      required={ehMenorDeIdade}
                    />
                  </div>

                  <div className="responsavel-endereco-title">
                    <h4>Endereço do Responsável</h4>
                  </div>

                  <div className="field">
                    <label>Rua</label>
                    <input
                      name="rua"
                      value={responsaveis[responsavelAtivo].rua}
                      onChange={(e) => handleResponsavelChange("rua", e.target.value)}
                      placeholder="Nome da rua"
                      required={ehMenorDeIdade}
                    />
                  </div>

                  <div className="field-row">
                    <div className="field">
                      <label>Número</label>
                      <input
                        name="numero"
                        value={responsaveis[responsavelAtivo].numero}
                        onChange={(e) => handleResponsavelChange("numero", e.target.value)}
                        placeholder="Ex: 123"
                        required={ehMenorDeIdade}
                      />
                    </div>

                    <div className="field">
                      <label>Bairro</label>
                      <input
                        name="bairro"
                        value={responsaveis[responsavelAtivo].bairro}
                        onChange={(e) => handleResponsavelChange("bairro", e.target.value)}
                        placeholder="Nome do bairro"
                        required={ehMenorDeIdade}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="botao-salvar"
              title="Salvar alterações"
            >
              💾 Salvar alterações
            </button>
            <button type="button" className="botao-cancelar" onClick={() => navigate("/dashboard")}>
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
