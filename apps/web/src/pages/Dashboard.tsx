import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css"
import "../styles/app.css"

interface Responsavel {
  nome: string;
  grauParentesco: string;
  whatsapp: string;
  cpf: string;
  email: string;
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

export default function Dashboard() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState<{ texto: string; tipo: "sucesso" | "erro" } | null>(null);
  const [alunoADeletar, setAlunoADeletar] = useState<Aluno | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");
  const [filtroCpf, setFiltroCpf] = useState("");
  const [filtroWhatsapp, setFiltroWhatsapp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    buscarAlunos();
  }, []);

  // ======================
  // LÓGICA DE FILTROS
  // ======================
  const alunosFiltrados = alunos.filter((aluno) => {
    const nomeMatch = aluno.nome.toLowerCase().includes(filtroNome.toLowerCase());
    const emailMatch = aluno.email.toLowerCase().includes(filtroEmail.toLowerCase());
    const cpfMatch = aluno.cpf.includes(filtroCpf);
    const whatsappMatch = aluno.whatsapp.includes(filtroWhatsapp);

    return nomeMatch && emailMatch && cpfMatch && whatsappMatch;
  });

  // ======================
  // CÁLCULO DE PAGINAÇÃO
  // ======================
  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const alunosAtuais = alunosFiltrados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina);

  const mudarPagina = (numeroPagina: number) => {
    setPaginaAtual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mudarItensPorPagina = (quantidade: number) => {
    setItensPorPagina(quantidade);
    setPaginaAtual(1);
  };

  const limparFiltros = () => {
    setFiltroNome("");
    setFiltroEmail("");
    setFiltroCpf("");
    setFiltroWhatsapp("");
    setPaginaAtual(1);
  };

  // ======================
  // EXIBIR MENSAGEM
  // ======================
  const exibirMensagem = (texto: string, tipo: "sucesso" | "erro") => {
    setMensagem({ texto, tipo });
    setTimeout(() => setMensagem(null), 4000);
  };

  // ======================
  // BUSCAR ALUNOS
  // ======================
  const buscarAlunos = async () => {
    setCarregando(true);
    setErro("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://api.santos-tech.com/api/alunos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleLogout();
        return;
      }

      if (!response.ok) {
        setErro("Erro ao buscar alunos");
        return;
      }

      const data = await response.json();
      setAlunos(data);
    } catch (error) {
      console.error("❌ Erro ao buscar alunos:", error);
      setErro("Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  };

  // ======================
  // DELETAR ALUNO
  // ======================
  const abrirConfirmacaoDeletar = (aluno: Aluno) => {
    setAlunoADeletar(aluno);
  };

  const cancelarDeletar = () => {
    setAlunoADeletar(null);
  };

  const confirmarDeletar = async () => {
    if (!alunoADeletar) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://api.santos-tech.com/api/alunos/${alunoADeletar.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        exibirMensagem(data.erro || "Erro ao deletar aluno", "erro");
        setAlunoADeletar(null);
        return;
      }

      exibirMensagem("Aluno deletado com sucesso!", "sucesso");
      setAlunoADeletar(null);
      buscarAlunos(); // 🔄 atualiza lista
    } catch (error) {
      console.error("❌ Erro ao deletar aluno:", error);
      exibirMensagem("Erro ao conectar com o servidor", "erro");
      setAlunoADeletar(null);
    }
  };

  // ======================
  // EDITAR ALUNO (por enquanto)
  // ======================
  const editarAluno = (aluno: Aluno) => {
    navigate(`/alunos/editar/${aluno.id}`);
  };

  // ======================
  // LOGOUT
  // ======================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ======================
  // RENDER
  // ======================
  return (
    <div className="Tudo">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard Jovem Tech RP</h1>
          <div>
            <button className="botao-home" onClick={() => navigate("/")}>
              🏠 Home
            </button>
            <button onClick={handleLogout} className="botao-sair">
              🚪 Sair
            </button>
          </div>
        </header>

        {mensagem && (
          <div className={`mensagem-toast mensagem-${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

        {carregando && (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Carregando dados...</p>
          </div>
        )}

        {erro && <p className="erro-dashboard">{erro}</p>}

        {!carregando && !erro && (
          <>
            <div className="dashboard-stats">
              <h2>Total de alunos: {alunosFiltrados.length} {alunosFiltrados.length !== alunos.length && `(${alunos.length} no total)`}</h2>
              <div className="pagination-control">
                <label>Itens por página:</label>
                <select
                  value={itensPorPagina}
                  onChange={(e) => mudarItensPorPagina(Number(e.target.value))}
                  className="items-per-page-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {/* Seção de Filtros */}
            <div className="filtros-container">
              <h3>Filtros de Pesquisa</h3>
              <div className="filtros-grid">
                <div className="filtro-field">
                  <label htmlFor="filtro-nome">Nome:</label>
                  <input
                    id="filtro-nome"
                    type="text"
                    placeholder="Pesquisar por nome..."
                    value={filtroNome}
                    onChange={(e) => {
                      setFiltroNome(e.target.value);
                      setPaginaAtual(1);
                    }}
                    className="filtro-input"
                  />
                </div>

                <div className="filtro-field">
                  <label htmlFor="filtro-email">Email:</label>
                  <input
                    id="filtro-email"
                    type="text"
                    placeholder="Pesquisar por email..."
                    value={filtroEmail}
                    onChange={(e) => {
                      setFiltroEmail(e.target.value);
                      setPaginaAtual(1);
                    }}
                    className="filtro-input"
                  />
                </div>

                <div className="filtro-field">
                  <label htmlFor="filtro-cpf">CPF:</label>
                  <input
                    id="filtro-cpf"
                    type="text"
                    placeholder="Pesquisar por CPF..."
                    value={filtroCpf}
                    onChange={(e) => {
                      setFiltroCpf(e.target.value);
                      setPaginaAtual(1);
                    }}
                    className="filtro-input"
                  />
                </div>

                <div className="filtro-field">
                  <label htmlFor="filtro-whatsapp">WhatsApp:</label>
                  <input
                    id="filtro-whatsapp"
                    type="text"
                    placeholder="Pesquisar por WhatsApp..."
                    value={filtroWhatsapp}
                    onChange={(e) => {
                      setFiltroWhatsapp(e.target.value);
                      setPaginaAtual(1);
                    }}
                    className="filtro-input"
                  />
                </div>
              </div>

              <button onClick={limparFiltros} className="botao-limpar-filtros">
                🔄 Limpar Filtros
              </button>
            </div>

            <div className="tabela-container">
              <table className="tabela-alunos">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Data Nasc.</th>
                    <th>WhatsApp</th>
                    <th>Email</th>
                    <th>CPF</th>
                    <th>Responsável</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {alunosAtuais.map((aluno) => (
                    <tr key={aluno.id}>
                      <td>{aluno.id}</td>
                      <td>{aluno.nome}</td>
                      <td>
                        {new Date(aluno.data_nascimento).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td>{aluno.whatsapp}</td>
                      <td>{aluno.email}</td>
                      <td>{aluno.cpf}</td>
                      <td>
                        {aluno.responsaveis && aluno.responsaveis.length > 0 ? (
                          <div style={{ fontSize: "0.85rem" }}>
                            {aluno.responsaveis.map((resp, idx) => (
                              <div key={idx} style={{ marginBottom: "8px", paddingBottom: "8px", borderBottom: idx < aluno.responsaveis!.length - 1 ? "1px solid #eee" : "none" }}>
                                <strong>{resp.nome}</strong>
                                <br />
                                ({resp.grauParentesco})
                                <br />
                                <span style={{ color: "#666" }}>{resp.whatsapp}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: "#999" }}>-</span>
                        )}
                      </td>
                      <td style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => editarAluno(aluno)}
                          className="botao-editar"
                          title="Editar aluno"
                        >
                          ✏️ Editar
                        </button>

                        <button
                          onClick={() => abrirConfirmacaoDeletar(aluno)}
                          className="botao-excluir"
                          title="Deletar aluno"
                        >
                          🗑️ Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de paginação */}
            {totalPaginas > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => mudarPagina(paginaAtual - 1)}
                  disabled={paginaAtual === 1}
                >
                  ← Anterior
                </button>

                <div className="pagination-numbers">
                  {[...Array(totalPaginas)].map((_, index) => {
                    const numeroPagina = index + 1;

                    // Mostrar apenas páginas próximas à atual
                    if (
                      numeroPagina === 1 ||
                      numeroPagina === totalPaginas ||
                      (numeroPagina >= paginaAtual - 1 && numeroPagina <= paginaAtual + 1)
                    ) {
                      return (
                        <button
                          key={numeroPagina}
                          className={`pagination-number ${paginaAtual === numeroPagina ? 'active' : ''}`}
                          onClick={() => mudarPagina(numeroPagina)}
                        >
                          {numeroPagina}
                        </button>
                      );
                    } else if (
                      numeroPagina === paginaAtual - 2 ||
                      numeroPagina === paginaAtual + 2
                    ) {
                      return <span key={numeroPagina} className="pagination-ellipsis">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => mudarPagina(paginaAtual + 1)}
                  disabled={paginaAtual === totalPaginas}
                >
                  Próximo →
                </button>
              </div>
            )}

            <div className="pagination-info">
              Mostrando {indexPrimeiro + 1} a {Math.min(indexUltimo, alunos.length)} de {alunos.length} alunos
            </div>
          </>
        )}

        {/* Modal de Confirmação */}
        {alunoADeletar && (
          <div className="modal-overlay">
            <div className="modal-confirmacao">
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir o aluno <strong>{alunoADeletar.nome}</strong>?</p>
              <p className="modal-aviso">Esta ação não pode ser desfeita.</p>
              <div className="modal-buttons">
                <button onClick={cancelarDeletar} className="botao-cancelar-modal">
                  ❌ Cancelar
                </button>
                <button onClick={confirmarDeletar} className="botao-confirmar-modal">
                  🗑️ Deletar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
