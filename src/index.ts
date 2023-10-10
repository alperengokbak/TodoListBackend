// Apollo Server Declaration
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { json } from "body-parser";
import { MyContext, createContext } from "./context";
import express from "express";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { mergeResolvers } from "@graphql-tools/merge";

// Declaration TypeDefs
import listTypeDefs from "../src/graphql/typedefs/list";
import noteTypeDefs from "../src/graphql/typedefs/note";
import userTypeDefs from "../src/graphql/typedefs/user";
import auth from "../src/graphql/typedefs/auth";

// Declaration Resolvers
import { listResolver } from "../src/graphql/resolvers/listResolver";
import { noteResolver } from "../src/graphql/resolvers/noteResolver";
import { userResolver } from "../src/graphql/resolvers/userResolver";
import { authResolver } from "./graphql/resolvers/authResolver";

const typeDefs = mergeTypeDefs([listTypeDefs, noteTypeDefs, userTypeDefs, auth]);
const resolvers = mergeResolvers([userResolver, listResolver, noteResolver, authResolver]);

const app = express();
const PORT = 4001;

async function main() {
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    introspection: true,
  });

  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: (req) => createContext(req),
    })
  );
  app.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`));
}

main();
