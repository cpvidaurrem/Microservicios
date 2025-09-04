require("reflect-metadata");
const { DataSource } = require("typeorm");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema/typeDefs");
const makeResolvers = require("./schema/resolvers");

const Mesa = null; // no usado aquí; mantengo para referencia si adaptas del otro ejercicio

const Libro = require("./entity/Libro");
const Prestamo = require("./entity/Prestamo");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "", // <- cambiar
  database: "graphql_biblioteca",
  synchronize: true,
  logging: false,
  entities: [Libro, Prestamo],
});

async function startServer() {
  await AppDataSource.initialize();
  console.log("✅ Conectado a la base de datos");

  const app = express();

  const resolvers = makeResolvers(AppDataSource);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(
      `🚀 Servidor listo en http://localhost:4000${server.graphqlPath}`
    );
  });
}

startServer().catch((err) => {
  console.error("Error al arrancar:", err);
});
