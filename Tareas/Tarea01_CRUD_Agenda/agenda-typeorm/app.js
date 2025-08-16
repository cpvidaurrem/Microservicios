require("reflect-metadata");
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const AppDataSource = require("./data-source");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

AppDataSource.initialize().then(() => {
  const repo = AppDataSource.getRepository("Agenda");

  app.get("/", async (req, res) => {
    const agenda = await repo.find();
    res.render("index", { agenda });
  });

  app.get("/new", (req, res) => res.render("new"));

  app.post("/", async (req, res) => {
    await repo.save(req.body);
    res.redirect("/");
  });

  app.get("/edit/:id", async (req, res) => {
    const persona = await repo.findOneBy({ id: parseInt(req.params.id) });

    // Función para asegurar formato YYYY-MM-DD
    const toInputDate = (d) => {
      if (!d) return "";
      if (d instanceof Date) return d.toISOString().slice(0, 10);
      return String(d).slice(0, 10);
    };

    res.render("edit", {
      persona,
      fechaNacimientoISO: toInputDate(persona.fecha_nacimiento),
    });
  });

  app.put("/:id", async (req, res) => {
    await repo.update(req.params.id, req.body);
    res.redirect("/");
  });

  app.delete("/:id", async (req, res) => {
    await repo.delete(req.params.id);
    res.redirect("/");
  });

  app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
});
