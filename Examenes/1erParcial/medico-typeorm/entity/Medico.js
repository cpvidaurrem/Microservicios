const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Medico',
  tableName: 'medico',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    nombres: { type: 'varchar', length: 100 },
    apellidos: { type: 'varchar', length: 100 },
    cedula_profesional: {type: 'varchar', length: 15},
    especialidad: { type: 'varchar', length: 255 },
    anios_experiencia: { type: 'varchar', length: 20 },
    correo_electronico: { type: 'varchar', length: 100 },
    
  },
});
