import { useFormulario } from "../hooks/useFormulario";

export function Formulario() {
  const { values, mensagem, handleChange, handleSubmit } = useFormulario();

  return (
    <form className="inputs" onSubmit={handleSubmit}>
      <input
        name="nome"
        placeholder="Nome completo"
        value={values.nome}
        onChange={handleChange}
      /><br />

      <input
        type="text"
        name="dataNascimento"
        value={values.dataNascimento}
        onChange={handleChange}
        placeholder="Data de nascimento"
      /><br />

      <input
        type="tel"
        name="whatsapp"
        placeholder="WhatsApp"
        value={values.whatsapp}
        onChange={handleChange}
      /><br />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={values.email}
        onChange={handleChange}
      /><br />

      <input
        name="cpf"
        placeholder="CPF"
        value={values.cpf}
        onChange={handleChange}
      /><br />

      <p>{mensagem}</p>

      <button type="submit">Enviar</button>
    </form>
  );
}
