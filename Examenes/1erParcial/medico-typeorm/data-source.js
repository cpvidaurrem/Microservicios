require('reflect-metadata');
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'db',
  username: 'usersuser',
  password: 'userpass',
  database: 'usersdb',
  port: '3306',
  synchronize: true, // crea tabla si no existe
  entities: [require('./entity/Medico')],
});

module.exports = AppDataSource;
