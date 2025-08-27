const express = require("express");
const app = express();
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir el formulario
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Calculadora Web</title>
        <style>
          body { font-family: Arial; margin: 50px; }
          .container { max-width: 400px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; }
          input, select, button { display: block; margin: 10px 0; padding: 8px; width: 100%; }
          .result { margin-top: 20px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Calculadora Web</h2>
          <form action="/calcular" method="post">
            <label>Valor de A:</label>
            <input type="number" name="a" step="any" required>
            <label>Valor de B:</label>
            <input type="number" name="b" step="any" required>
            <label>Operación:</label>
            <select name="operacion">
              <option value="sumar">Sumar</option>
              <option value="restar">Restar</option>
              <option value="multiplicar">Multiplicar</option>
              <option value="dividir">Dividir</option>
            </select>
            <button type="submit">Calcular</button>
          </form>
          <div class="result">
            <p id="resultado"></p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Ruta de cálculo
app.post("/calcular", (req, res) => {
  const { a, b, operacion } = req.body;
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  let resultado;

  switch (operacion) {
    case "sumar":
      resultado = numA + numB;
      break;
    case "restar":
      resultado = numA - numB;
      break;
    case "multiplicar":
      resultado = numA * numB;
      break;
    case "dividir":
      resultado = numB !== 0 ? numA / numB : "Error: división entre 0";
      break;
    default:
      resultado = "Operación no válida";
  }

  res.send(`
    <html>
      <head><title>Resultado</title></head>
      <body>
        <h2>Resultado: ${resultado}</h2>
        <a href="/">Volver</a>
      </body>
    </html>
  `);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
