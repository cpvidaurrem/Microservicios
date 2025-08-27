require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Config DB desde env
const DB_HOST = process.env.DB_HOST || "db";
const DB_USER = process.env.DB_USER || "usersuser";
const DB_PASSWORD = process.env.DB_PASSWORD || "userpass";
const DB_NAME = process.env.DB_NAME || "usersdb";
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const PORT = process.env.PORT || 8080;

// pool
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

// intenta conectar con reintentos
async function waitForDatabase(retries = 10, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      console.log("✅ Conectado a la base de datos MySQL");
      return;
    } catch (err) {
      console.log(
        `⚠️  DB no lista, reintentando en ${delayMs / 1000}s... (${
          i + 1
        }/${retries})`
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error(
    "No se pudo conectar a la base de datos después de varios intentos"
  );
}

// crear tabla si no existe (seguro si no usas init SQL)
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Rutas
app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, created_at FROM users ORDER BY id DESC"
    );
    res.render("index", { users: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener usuarios");
  }
});

app.get("/add", (req, res) => {
  res.render("add", { error: null, old: {} });
});

app.post("/add", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.render("add", {
      error: "Nombre y correo son obligatorios",
      old: { name, email },
    });
  }
  try {
    await pool.query("INSERT INTO users (name, email) VALUES (?, ?)", [
      name,
      email,
    ]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    const msg =
      err && err.code === "ER_DUP_ENTRY"
        ? "El correo ya existe"
        : "Error al guardar usuario";
    res.render("add", { error: msg, old: { name, email } });
  }
});

app.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al eliminar usuario");
  }
});

// arrancar servidor después de asegurar DB
async function start() {
  try {
    await waitForDatabase(15, 2000);
    await ensureTable();
    app.listen(PORT, () =>
      console.log(`✅ App corriendo en http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Fallo al iniciar la app:", err);
    process.exit(1);
  }
}

start();
