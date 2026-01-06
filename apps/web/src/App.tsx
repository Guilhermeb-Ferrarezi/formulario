import "./styles/app.css";
import { Formulario } from "./components/formulario";

export function App() {
  return (
    <div className="centro">
      <main>
        <h1 className="titulo">
          Bem-vindo à Escola! <br />
          Cadastre-se
        </h1>

        <Formulario />
      </main>
    </div>
  );
}
