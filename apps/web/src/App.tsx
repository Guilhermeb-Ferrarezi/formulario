import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Formulario } from "./components/formulario";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import Dashboard from "./pages/Dashboard";
import EditarAluno from "./pages/EditarAluno";


export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página pública - Formulário de cadastro */}
        <Route
          path="/"
          element={
            <div className="centro">
              <main>
                <Formulario />
              </main>
            </div>
          }
        />

        {/* Página de Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/alunos/editar/:id" element={<EditarAluno />} />

        {/* Dashboard Protegido */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}