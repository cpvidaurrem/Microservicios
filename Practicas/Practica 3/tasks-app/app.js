require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Task = require("./models/task");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/tasksdb";

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Conexión a MongoDB con reintentos (útil si arrancas mongo con Docker Compose)
async function connectWithRetry(retries = 10, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Conectado a MongoDB");
      return;
    } catch (err) {
      console.log(
        `⚠️  MongoDB no disponible. Reintentando en ${delayMs / 1000}s... (${
          i + 1
        }/${retries})`
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error("No se pudo conectar a MongoDB tras varios intentos");
}

// RUTAS

// Listar tareas
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.render("index", { tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener tareas");
  }
});

// Form para crear
app.get("/tasks/new", (req, res) => {
  res.render("new", { error: null, old: {} });
});

// Crear tarea
app.post("/tasks", async (req, res) => {
  const { title, description, status } = req.body;
  if (!title || title.trim() === "") {
    return res.render("new", {
      error: "El título es obligatorio",
      old: { title, description, status },
    });
  }
  try {
    await Task.create({ title: title.trim(), description, status });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al crear la tarea");
  }
});

// Ver tarea
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("Tarea no encontrada");
    res.render("show", { task });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar tarea");
  }
});

// Form editar
app.get("/tasks/:id/edit", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("Tarea no encontrada");
    res.render("edit", { task, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al cargar formulario de edición");
  }
});

// Actualizar tarea (PUT)
app.put("/tasks/:id", async (req, res) => {
  const { title, description, status } = req.body;
  if (!title || title.trim() === "") {
    const task = await Task.findById(req.params.id);
    return res.render("edit", { task, error: "El título es obligatorio" });
  }
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      title: title.trim(),
      description,
      status,
    });
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al actualizar tarea");
  }
});

// Eliminar tarea (DELETE)
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar tarea");
  }
});

// START
(async () => {
  try {
    await connectWithRetry(15, 2000);
    app.listen(PORT, () =>
      console.log(`✅ App corriendo en http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Fallo al iniciar la aplicación:", err);
    process.exit(1);
  }
})();
