const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const productsRouter = require("./routes/products");
const clientsRouter = require("./routes/clients");
const invoicesRouter = require("./routes/invoices");
const invoiceDetailsRouter = require("./routes/invoiceDetails");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const swaggerDoc = YAML.load(path.join(__dirname, "swagger", "openapi.yaml"));

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/api/products", productsRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/invoice-details", invoiceDetailsRouter);

// Swagger docs
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Error handler (último middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    // Para desarrollo: crea/ajusta tablas. En producción usar migraciones.
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error("Unable to start server:", err);
    process.exit(1);
  }
}

start();
