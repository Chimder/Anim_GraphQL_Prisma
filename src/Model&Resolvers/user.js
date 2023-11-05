import UserModel from "../models/user.model";

const MankaResoler = {
  Query: {
    getManga: async (_, { id }) => {
      return await UserModel.findById(id);
    },
    getMangas: async () => {
      return await UserModel.find();
    },
    getMangasByGenres: async (_, { input }) => {
      return await UserModel.find().all("genres", input);
    },
    getMangasByInput: async (_, { input }) => {
      return await UserModel.aggregate([
        { $match: { name: { $regex: input, $options: "i" } } },
      ]);
    },
  },
};
export default MankaResoler;
