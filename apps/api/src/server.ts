import express from "express";
import cors from "cors";

const app = express();

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

app.listen(3333, () => {
  console.log("API rodando");
});
