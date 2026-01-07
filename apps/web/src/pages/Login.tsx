import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const response = await fetch("https://api.santos-tech.com/api/auth/login", {
  // ... resto
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Salva token no localStorage
        localStorage.setItem("token", data.token);
        // Redireciona para o dashboard
        navigate("/dashboard");
      } else {
        setErro("❌ Usuário ou senha inválidos");
      }
    } catch (error) {
      setErro("❌ Erro ao conectar com o servidor");
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="centro">
      <main style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="titulo">🔒 Login Administrativo</h1>
        
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: "0.75rem", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "0.75rem", fontSize: "1rem", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          
          {erro && <p style={{ color: "red", margin: 0 }}>{erro}</p>}
          
          <button 
            type="submit" 
            disabled={carregando}
            style={{ 
              padding: "0.75rem", 
              fontSize: "1rem", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "8px",
              cursor: carregando ? "not-allowed" : "pointer"
            }}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
        
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <a href="/" style={{ color: "#007bff" }}>← Voltar para cadastro</a>
        </p>
      </main>
    </div>
  );
}