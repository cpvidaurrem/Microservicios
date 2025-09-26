require('reflect-metadata');
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'medico_db',
  synchronize: true, // crea tabla si no existe
  entities: [require('./entity/Medico')],
});

module.exports = AppDataSource;
