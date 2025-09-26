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
  const repo = AppDataSource.getRepository("Medico");

  app.get("/", async (req, res) => {
    const medico = await repo.find();
    res.render("index", { medico });
  });

  app.get("/new", (req, res) => res.render("new"));

  app.post("/", async (req, res) => {
    await repo.save(req.body);
    res.redirect("/");
  });

  app.get("/edit/:id", async (req, res) => {
    const persona = await repo.findOneBy({ id: parseInt(req.params.id) });

    res.render("edit", {
      persona,
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

  app.listen(8080, () => console.log("Servidor en http://localhost:8080"));
});
