import { GraphQLError } from "graphql";
import UserModel from "../models/user.model.js";
import MankaModel from "../models/manga.model.js";

export const typeDef = `#graphql
type User {
  _id:String
  name: String!
  email:String!
  favorite:[String]
  picture: String,
  local: String,
  lastRead: [LastRead]
}

type LastRead{
  name: String,
  chapter: Int,
}

input LastReadInput{
  name: String,
  chapter: Int,
}

input UserInput {
  name: String
  email:String!
  picture: String,
  local: String,
}
input updateUserInput {
  favorite:String
}
extend type Query {
  getUser(email: String!): User
  getUsers: [User!]!
  getUserFavoriteList(email:String!):[Manga]!
}
extend type Mutation {
  createUser(input:UserInput!): String!
  toggleUserArray(email:String!, favorite:String): Boolean!
  deleteUser(id:ID!): String!
  signUp(input:UserInput): String

  addLastRead(email:String!, input:LastReadInput): String
}
`;

export const userResolver = {
  Query: {
    getUserFavoriteList: async (_, { email }) => {
      const user = await UserModel.findOne({ email: email });
      const userManka = await MankaModel.find({ name: user.favorite });
      return userManka;
    },
    getUser: async (_, { email }) => {
      return await UserModel.findOne({ email: email });
    },
    getUsers: async () => {
      return await UserModel.find();
    },
  },
  Mutation: {
    createUser: async (_, { input: { name, email, picture, local } }) => {
      const res = await new UserModel({ name, email, picture, local }).save();
      return res._id;
    },

    addLastRead: async (_, { email, input: { name, chapter } }) => {
      const res = await UserModel.findOne({ email: email });
      const filter = await res.lastRead.some((obj) => obj.name == name);

      if (filter) {
        await UserModel.updateOne(
          { email: email, "lastRead.name": name },
          {
            $set: {
              "lastRead.$.chapter": chapter,
            },
          }
        );
      } else {
        await UserModel.updateOne(
          { email: email },
          { $push: { lastRead: { name: name, chapter: chapter } } }
        );
      }
      return filter;
    },

    toggleUserArray: async (_, { email, favorite }) => {
      const res = await UserModel.findOne({ email: email });
      const filter = await res.favorite.includes(favorite);

      if (!filter) {
        await UserModel.updateOne(
          { email: email },
          { $push: { favorite: favorite } }
        );
      } else {
        await UserModel.updateOne(
          { email: email },
          { $pull: { favorite: favorite } }
        );
      }
      return filter;
    },

    signUp: async (_, { input: { name, email, picture, local } }) => {
      const isUserExists = await UserModel.findOne({ email: email });
      if (isUserExists) {
      } else {
        const res = await new UserModel({ name, email, picture, local }).save();
        return res._id;
      }
    },

    deleteUser: async (_, { id }) => {
      await UserModel.findByIdAndRemove(id);
      return id;
    },
  },
};
