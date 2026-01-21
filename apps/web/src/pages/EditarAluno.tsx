import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/editar.css";

interface Aluno {
  id: number;
  nome: string;
  data_nascimento: string;
  whatsapp: string;
  email: string;
  cpf: string;
  responsavel_nome?: string;
  responsavel_grau_parentesco?: string;
  responsavel_whatsapp?: string;
  responsavel_cpf?: string;
  responsavel_email?: string;
}

export default function EditarAluno() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [alunoOriginal, setAlunoOriginal] = useState<Aluno | null>(null);
  const [mensagem, setMensagem] = useState<{
  texto: string;
  tipo: "sucesso" | "erro";
    } | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [mostrarResponsavel, setMostrarResponsavel] = useState(false);

  // Calcular se é menor de idade
  const ehMenorDeIdade = useMemo(() => {
    if (!aluno?.data_nascimento) return false;
    const hoje = new Date();
    const nascimento = new Date(aluno.data_nascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade < 18;
  }, [aluno?.data_nascimento]);

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
      setAlunoOriginal(data); // Salvar estado original

      // Verificar se tem dados de responsável
      if (data.responsavel_nome || data.responsavel_grau_parentesco ||
          data.responsavel_whatsapp || data.responsavel_cpf || data.responsavel_email) {
        setMostrarResponsavel(true);
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
  // ATUALIZAR CAMPOS
  // ======================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!aluno) return;

    const { name, value } = e.target;
    setAluno({ ...aluno, [name]: value });
  };

  // ======================
  // VERIFICAR SE HOUVE MUDANÇAS
  // ======================
  const houveAlteracoes = useMemo(() => {
    if (!aluno || !alunoOriginal) return false;
    return JSON.stringify(aluno) !== JSON.stringify(alunoOriginal);
  }, [aluno, alunoOriginal]);

  // ======================
  // SALVAR ALTERAÇÕES
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!houveAlteracoes) {
      setMensagem({
        texto: "Nenhuma alteração foi feita",
        tipo: "erro",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://api.santos-tech.com/api/alunos/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(aluno),
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
        texto: "Aluno atualizado com sucesso!",
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

          {/* Seção de dados do responsável */}
          <div className="form-section responsavel-section">
            <div className="section-header-with-toggle">
              <div>
                <h3>👤 Dados do Responsável</h3>
                <p className="section-description">
                  {ehMenorDeIdade
                    ? "Como o candidato é menor de idade, os dados do responsável são obrigatórios."
                    : "Adicione dados do responsável (opcional)."}
                </p>
              </div>
              <button
                type="button"
                className="toggle-responsavel-btn"
                onClick={() => setMostrarResponsavel(!mostrarResponsavel)}
              >
                {mostrarResponsavel ? "Ocultar" : "Adicionar"}
              </button>
            </div>

            {mostrarResponsavel && (
              <>
                <div className="field">
                  <label>Nome completo do responsável</label>
                  <input
                    name="responsavel_nome"
                    value={aluno.responsavel_nome || ""}
                    onChange={handleChange}
                    placeholder="Nome completo do responsável"
                    required={ehMenorDeIdade}
                  />
                </div>

                <div className="field">
                  <label>Grau de parentesco</label>
                  <div className="parentesco-selector">
                    <button
                      type="button"
                      className={`parentesco-option ${aluno.responsavel_grau_parentesco === 'Pai' ? 'selected' : ''}`}
                      onClick={() => setAluno({ ...aluno, responsavel_grau_parentesco: 'Pai' })}
                    >
                      👨 Pai
                    </button>
                    <button
                      type="button"
                      className={`parentesco-option ${aluno.responsavel_grau_parentesco === 'Mãe' ? 'selected' : ''}`}
                      onClick={() => setAluno({ ...aluno, responsavel_grau_parentesco: 'Mãe' })}
                    >
                      👩 Mãe
                    </button>
                    <button
                      type="button"
                      className={`parentesco-option ${aluno.responsavel_grau_parentesco === 'Tutor(a)' ? 'selected' : ''}`}
                      onClick={() => setAluno({ ...aluno, responsavel_grau_parentesco: 'Tutor(a)' })}
                    >
                      👤 Tutor(a)
                    </button>
                    <button
                      type="button"
                      className={`parentesco-option ${aluno.responsavel_grau_parentesco === 'Avô/Avó' ? 'selected' : ''}`}
                      onClick={() => setAluno({ ...aluno, responsavel_grau_parentesco: 'Avô/Avó' })}
                    >
                      👴 Avô/Avó
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label>WhatsApp do responsável</label>
                  <input
                    name="responsavel_whatsapp"
                    value={aluno.responsavel_whatsapp || ""}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    required={ehMenorDeIdade}
                  />
                </div>

                <div className="field">
                  <label>CPF do responsável</label>
                  <input
                    name="responsavel_cpf"
                    value={aluno.responsavel_cpf || ""}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    required={ehMenorDeIdade}
                  />
                </div>

                <div className="field">
                  <label>E-mail do responsável</label>
                  <input
                    type="email"
                    name="responsavel_email"
                    value={aluno.responsavel_email || ""}
                    onChange={handleChange}
                    placeholder="email@exemplo.com"
                    required={ehMenorDeIdade}
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="botao-salvar"
              disabled={!houveAlteracoes}
              title={!houveAlteracoes ? "Nenhuma alteração foi feita" : "Salvar alterações"}
            >
              💾 {houveAlteracoes ? "Salvar alterações" : "Sem alterações"}
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
