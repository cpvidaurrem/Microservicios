const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Agenda',
  tableName: 'agenda',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    nombres: { type: 'varchar', length: 100 },
    apellidos: { type: 'varchar', length: 100 },
    fecha_nacimiento: { type: 'date' },
    celular: { type: 'varchar', length: 20 },
    correo: { type: 'varchar', length: 100 },
    direccion: { type: 'varchar', length: 255 },
  },
});
