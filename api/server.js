const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const candidateDirs = [
  path.join(__dirname, "web"),
  path.join(__dirname, "..", "web"),
];
const WEB_DIR = candidateDirs.find((p) => fs.existsSync(p)) || candidateDirs[1];

app.use(express.static(WEB_DIR));

console.log("🌐 Servindo arquivos estáticos de:", WEB_DIR);


const eventos = [
  {
    id: 1,
    tituloEvento: "Festival de músicas",
    descricao: "Evento de música com diversas atrações",
    categoria: "Musica",
    dataInicio: new Date(2025, 7, 15),
    dataFim: new Date(2025, 7, 15),
    localizacao: "Sesc Teresópolis, varzea",
    preco: 50.0,
    disponibilidade: "Disponivel",
  },
];

app.get("/api/eventos/:id", (req, res) => {
  const id = Number(req.params.id);
  const evento = eventos.find((l) => l.id === id);
  if (!evento) return res.status(404).json({ error: "Evento não encontrado" });
  return res.json(evento);
});

app.get("/api/eventos", (req, res) => {
  return res.json(eventos);
});

app.post("/api/eventos", (req, res) => {
  const b = req.body;

  const viaCriar =
    b.eventTitle || b.eventDescription || b.eventCategory || b.startDate;
  const viaCalendario = b.eventName || b.eventDate || b.eventTime;

  const novoEvento = viaCriar
    ? {
        tituloEvento: b.eventTitle,
        descricao: b.eventDescription,
        categoria: b.eventCategory || "Outros",
        dataInicio: b.startDate,
        dataFim: b.endDate || b.startDate,
        localizacao: b.eventLocation,
        preco: Number(b.ticketPrice || 0),
        disponibilidade:
          Number(b.ticketAvailability || 0) > 0 ? "Disponivel" : "Encerrado",
      }
    : viaCalendario
    ? {
        tituloEvento: b.eventName,
        descricao: b.eventDescription || "",
        categoria: "Outros",
        dataInicio: `${b.eventDate}T${b.eventTime || "00:00"}`,
        dataFim: `${b.eventDate}T${b.eventTime || "00:00"}`,
        localizacao: b.eventLocation,
        preco: 0,
        disponibilidade: "Disponivel",
      }
    : {
        tituloEvento: b.tituloEvento,
        descricao: b.descricao,
        categoria: b.categoria || "Outros",
        dataInicio: b.dataInicio,
        dataFim: b.dataFim || b.dataInicio,
        localizacao: b.localizacao,
        preco: Number(b.preco || 0),
        disponibilidade: b.disponibilidade || "Disponivel",
      };

  const camposObrigatorios = [
    "tituloEvento",
    "descricao",
    "categoria",
    "dataInicio",
    "dataFim",
    "localizacao",
  ];
  const todosPreenchidos = camposObrigatorios.every((c) => novoEvento[c]);
  if (!todosPreenchidos) {
    return res
      .status(400)
      .json({ error: "Todos os campos obrigatórios devem ser preenchidos" });
  }

  novoEvento.id = eventos.length + 1;
  eventos.push(novoEvento);
  return res.status(201).json(novoEvento);
});

app.delete("/api/eventos/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = eventos.findIndex((e) => e.id === id);
  if (index === -1)
    return res.status(404).json({ error: "Evento não encontrado" });
  eventos.splice(index, 1);
  return res.status(204).send();
});

app.get("*", (_, res) => {
  res.sendFile(path.join(WEB_DIR, "telaPrincipal.html"));
});

app.listen(3000, () =>
  console.log("✔️ Servidor em http://localhost:3000 (front + /api)")
);
