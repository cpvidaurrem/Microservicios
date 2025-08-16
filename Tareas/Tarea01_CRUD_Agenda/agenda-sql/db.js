const mysql = require('mysql2');

// Configuración de la conexión
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',          // Cambia si es necesario
  password: '',          // Tu contraseña de MySQL
  database: 'agenda_db'  // Nombre de la BD
});

// Conexión
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;