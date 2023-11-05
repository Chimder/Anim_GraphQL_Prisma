import { isArray } from "lodash-es";
import MankaModel from "../models/manga.model.js";

export const typeDef = `#graphql
type Manga {
  _id:String
  name: String!
  img:String!
  imgHeader: String!
  genres: [String!]!
  describe: String!
  chapters:[Chapter]
}

type Chapter{
  chapter: Int
  name:String
  img:[String]
}

input MangaInput {
  input: String
  genres:String
}
extend type Query {
  getManga(name: String!): Manga
  getChapter(name: String!, chapter:Int!): Chapter
  getMangasByAll(input:String, genres:[String] skip:Int, limit:Int): [Manga!]!
  # getTest(input:String, genres:[String]): [Manga!]!
}
`;

export const mankaResolver = {
  Query: {
    getManga: async (_, { name }) => {
      return await MankaModel.findOne({ name: name });
    },

    getChapter: async (_, { name, chapter }) => {
      const chap = await MankaModel.findOne({ name: name });
      const chapfilt = await chap.chapters.find((e) => e.chapter == chapter);
      return chapfilt;
    },
    // getTest: async (_, { input, genres, skip, limit }) => {
    //   if (input && genres) {
    //     const res = await MankaModel.find({
    //       name: { $regex: input, $options: "i" },
    //     }).all("genres", genres);
    //     // .skip(skip)
    //     // .limit(limit);
    //     console.log(res.length, "res");
    //   }
    //   if (genres) {
    //     const res1 = await MankaModel.find().all("genres", genres);
    //     // .skip(skip)
    //     // .limit(limit);
    //     console.log(res1.length, "res1");
    //   } else if (input) {
    //     const res2 = await MankaModel.aggregate([
    //       { $match: { name: { $regex: input, $options: "i" } } },
    //     ]);
    //     console.log(res2.length, "res2");
    //     // .skip(skip)
    //     // .limit(limit);
    //   } else {
    //     const res3 = await MankaModel.find();
    //     console.log(res3.length, "res3");
    //     return res3.length, res3;
    //     // .skip(skip).limit(limit);
    //   }
    // },

    getMangasByAll: async (_, { input, genres, skip, limit }) => {
      if (input && genres) {
        return await MankaModel.find({
          name: { $regex: input, $options: "i" },
        })
          .all("genres", genres)
          .skip(skip)
          .limit(limit);
      }
      if (genres) {
        return await MankaModel.find()
          .all("genres", genres)
          .skip(skip)
          .limit(limit);
      } else if (input) {
        return await MankaModel.aggregate([
          { $match: { name: { $regex: input, $options: "i" } } },
        ])
          .skip(skip)
          .limit(limit);
      } else {
        return await MankaModel.find().skip(skip).limit(limit);
      }
    },
  },
};
