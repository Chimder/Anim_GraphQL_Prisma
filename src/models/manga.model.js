import mongoose, { Schema, model } from "mongoose";

const MankaSchema = new Schema({
  name: String,
  img: String,
  imgHeader: String,
  describe: String,
  genres: [String],
  chapters: {
    type: Schema.Types.Array,
    ref: "chapters",
  },
});

const ChapterSchema = new Schema({
  chapter: Number,
  name: String,
  img: [String],
});
const ChapterModel = model("chapters", ChapterSchema);

const MankaModel = model("mankas", MankaSchema);
export default MankaModel;
