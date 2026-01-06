import "./app.css";

export function App() {
  return (
    <div className="centro">
      <main>
        <h1 className="titulo">
          Bem-vindo à Escola! <br />
          Cadastre-se
        </h1>
        <div className="inputs">
          <input type="text" placeholder="Nome completo"/>

          <input type="text" placeholder="Data de nascimento"/>

          <input type="text" placeholder="WhatsApp"/>

          <input type="text" placeholder="Email"/>

          <input type="text" placeholder="CPF"/>
        </div>
      </main>
    </div>
  );
}
