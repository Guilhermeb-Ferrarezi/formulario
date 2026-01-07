import "./styles/app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Formulario } from "./components/formulario";
import Dashboard from "./pages/Dashboard";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="centro">
              <main>
                <h1 className="titulo">
                  Bem-vindo à Escola! <br />
                  Cadastre-se
                </h1>
                <Formulario />
              </main>
            </div>
          }
        />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
