import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT
app.use(cors({
  origin: [
    "https://sga.santos-tech.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// suas rotas
app.post("/alunos", (req, res) => {
  res.status(201).json({ ok: true });
});

app.listen(PORT, () => {
  console.log("API rodando");
});
