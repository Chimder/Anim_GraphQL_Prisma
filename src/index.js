import "dotenv/config";
import { merge } from "lodash-es";
import mongoose from "mongoose";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { typeDef as Manga, mankaResolver } from "./TypeDefs&Resolvers/manga.js";
import { typeDef as User, userResolver } from "./TypeDefs&Resolvers/user.js";

const port = process.env.NODE_ENV === "development" ? 5555 : process.env.PORT;
const MONGODB = process.env.MONGODB_URL;

const Query = `#graphql
type Query {
  _empty:String
},
type Mutation {
  _empty:String
}
`;
const resolvers = {};

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: [Query, Manga, User],
    resolvers: merge(resolvers, mankaResolver, userResolver),
  }),
});

// const server = new ApolloServer({
//   typeDefs: MankatypeDef,
//   resolvers: MankaResoler,
// });

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB Connected");
    return startStandaloneServer(server, {
      listen: { port },
    });
  })
  .then((res) => {
    console.log(process.env.NODE_ENV);
    console.log(`Server running at ${res.url}`);
  });
