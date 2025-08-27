const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const Agenda = require("./models/Agenda");

const app = express();

// Middleware para formularios y métodos HTTP PUT/DELETE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Servir archivos estáticos desde la carpeta public
app.use(express.static("public"));

// Motor de plantillas
app.set("view engine", "ejs");

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/agenda", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rutas
// Listar contactos
app.get("/", async (req, res) => {
  const agenda = await Agenda.find();
  res.render("index", { agenda });
});

// Formulario nuevo contacto
app.get("/new", (req, res) => res.render("new"));

// Crear contacto
app.post("/", async (req, res) => {
  await Agenda.create(req.body);
  res.redirect("/");
});

// Formulario editar contacto
app.get("/edit/:id", async (req, res) => {
  const persona = await Agenda.findById(req.params.id);
  const fechaNacimientoISO = persona.fecha_nacimiento
    ? persona.fecha_nacimiento.toISOString().slice(0, 10)
    : "";
  res.render("edit", { persona, fechaNacimientoISO });
});

// Actualizar contacto
app.put("/:id", async (req, res) => {
  await Agenda.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});

// Eliminar contacto
app.delete("/:id", async (req, res) => {
  await Agenda.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Iniciar servidor
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
