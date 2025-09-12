# rust-graphql

query {
  alumnos {
    nombres
    apellidos
    sexo
    casado
    fechaNacimiento
    materias
  }
}



mutation {
  addAlumno(input: {
    nombres: "Luis"
    apellidos: "Torres"
    sexo: "M"
    casado: false
    fechaNacimiento: "2002-11-15"
    materias: ["SIS256", "SIS00"]
  }) {
    nombres
    apellidos
    materias
  }
}

query {
  alumno(nombres: "Ana") {
    nombres
    apellidos
    materias
  }
}