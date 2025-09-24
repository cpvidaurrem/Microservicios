import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";

const PROTO_PATH = path.resolve("./proto/estudiantes.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).estudiantes;

// "DB" en memoria
const estudiantes = [];   // array de objetos Estudiante
const cursos = [];        // array de objetos Curso
const inscripciones = {}; // map: ci -> Set(codigo)

// Implementación de métodos
const serviceImpl = {
  AgregarEstudiante: (call, callback) => {
    const nuevo = call.request;
    if (estudiantes.find(e => e.ci === nuevo.ci)) {
      return callback({ code: grpc.status.ALREADY_EXISTS, message: "Estudiante ya existe" });
    }
    estudiantes.push(nuevo);
    callback(null, { estudiante: nuevo });
  },

  AgregarCurso: (call, callback) => {
    const nuevo = call.request;
    if (cursos.find(c => c.codigo === nuevo.codigo)) {
      return callback({ code: grpc.status.ALREADY_EXISTS, message: "Curso ya existe" });
    }
    cursos.push(nuevo);
    callback(null, { curso: nuevo });
  },

  InscribirEstudiante: (call, callback) => {
    const { ci, codigo } = call.request;
    const est = estudiantes.find(e => e.ci === ci);
    if (!est) return callback({ code: grpc.status.NOT_FOUND, message: "Estudiante no encontrado" });

    const cur = cursos.find(c => c.codigo === codigo);
    if (!cur) return callback({ code: grpc.status.NOT_FOUND, message: "Curso no encontrado" });

    if (!inscripciones[ci]) inscripciones[ci] = new Set();
    if (inscripciones[ci].has(codigo)) {
      return callback({ code: grpc.status.ALREADY_EXISTS, message: "Estudiante ya inscrito en el curso" });
    }
    inscripciones[ci].add(codigo);
    callback(null, { message: `Inscripción exitosa: ${ci} -> ${codigo}` });
  },

  ListarCursosDeEstudiante: (call, callback) => {
    const { ci } = call.request;
    const est = estudiantes.find(e => e.ci === ci);
    if (!est) return callback({ code: grpc.status.NOT_FOUND, message: "Estudiante no encontrado" });

    const codes = inscripciones[ci] ? Array.from(inscripciones[ci]) : [];
    const listaCursos = cursos.filter(c => codes.includes(c.codigo));
    callback(null, { cursos: listaCursos });
  },

  ListarEstudiantesDeCurso: (call, callback) => {
    const { codigo } = call.request;
    const cur = cursos.find(c => c.codigo === codigo);
    if (!cur) return callback({ code: grpc.status.NOT_FOUND, message: "Curso no encontrado" });

    const cis = Object.entries(inscripciones)
      .filter(([, set]) => set.has(codigo))
      .map(([ci]) => ci);

    const alumnos = estudiantes.filter(e => cis.includes(e.ci));
    callback(null, { estudiantes: alumnos });
  }
};

// Arrancar servidor
const server = new grpc.Server();
server.addService(proto.EstudianteService.service, serviceImpl);

const PORT = "50051";
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
  if (err) {
    console.error("Error al bind:", err);
    return;
  }
  console.log(`Servidor gRPC escuchando en ${bindPort}`);
  server.start();
});
