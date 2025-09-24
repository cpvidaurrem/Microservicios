import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.resolve("./proto/estudiantes.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).estudiantes;

const client = new proto.EstudianteService("localhost:50051", grpc.credentials.createInsecure());

// Flujo: registrar estudiante -> registrar dos cursos -> inscribir -> listar
client.AgregarEstudiante({ ci: "1001", nombres: "Ana", apellidos: "Pérez", carrera: "Sistemas" }, (err, resp) => {
  if (err) return console.error("AgregarEstudiante error:", err);
  console.log("Estudiante agregado:", resp.estudiante);

  client.AgregarCurso({ codigo: "C101", nombre: "Algoritmos", docente: "Dr. X" }, (err, r1) => {
    if (err) return console.error("AgregarCurso error:", err);
    console.log("Curso agregado:", r1.curso);

    client.AgregarCurso({ codigo: "C102", nombre: "Bases de Datos", docente: "Dra. Y" }, (err, r2) => {
      if (err) return console.error("AgregarCurso error:", err);
      console.log("Curso agregado:", r2.curso);

      // Inscribir en C101
      client.InscribirEstudiante({ ci: "1001", codigo: "C101" }, (err, r3) => {
        if (err) return console.error("Inscribir error:", err);
        console.log(r3.message);

        // Inscribir en C102
        client.InscribirEstudiante({ ci: "1001", codigo: "C102" }, (err, r4) => {
          if (err) return console.error("Inscribir error:", err);
          console.log(r4.message);

          // Intento de inscripción duplicada -> debe devolver ALREADY_EXISTS
          client.InscribirEstudiante({ ci: "1001", codigo: "C101" }, (err) => {
            if (err) console.log("Inscripción duplicada (esperada):", err.code, err.message);

            // Listar cursos del estudiante
            client.ListarCursosDeEstudiante({ ci: "1001" }, (err, rc) => {
              if (err) return console.error("ListarCursosDeEstudiante error:", err);
              console.log("Cursos del estudiante 1001:", rc.cursos);

              // Listar estudiantes de C101
              client.ListarEstudiantesDeCurso({ codigo: "C101" }, (err, re) => {
                if (err) return console.error("ListarEstudiantesDeCurso error:", err);
                console.log("Estudiantes en C101:", re.estudiantes);
              });
            });
          });
        });
      });
    });
  });
});
