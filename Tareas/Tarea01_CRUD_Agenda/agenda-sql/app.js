const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Listar contactos (READ)
app.get('/', (req, res) => {
  const query = 'SELECT * FROM agenda';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render('index', { contactos: results });
  });
});

// Mostrar formulario para agregar (CREATE form)
app.get('/add', (req, res) => {
  res.render('add');
});

// Agregar contacto (CREATE)
app.post('/add', (req, res) => {
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  const query = 'INSERT INTO agenda (nombres, apellidos, fecha_nacimiento, direccion, celular, correo) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [nombres, apellidos, fecha_nacimiento, direccion, celular, correo], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/');
  });
});

// Mostrar formulario para editar (UPDATE form)
app.get('/edit/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM agenda WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render('edit', { contacto: results[0] });
  });
});

// Actualizar contacto (UPDATE)
app.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, fecha_nacimiento, direccion, celular, correo } = req.body;
  const query = 'UPDATE agenda SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, direccion = ?, celular = ?, correo = ? WHERE id = ?';
  db.query(query, [nombres, apellidos, fecha_nacimiento, direccion, celular, correo, id], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/');
  });
});

// Eliminar contacto (DELETE)
app.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM agenda WHERE id = ?';
  db.query(query, [id], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});