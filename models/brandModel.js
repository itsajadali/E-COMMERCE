const mongoose = require("mongoose");
// 1- Create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "brand required"],
      unique: [true, "brand must be unique"],
      minLength: [3, "Too short brand name"],
      maxLength: [32, "Too long brand name"],
    },
    // A and B => shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const modifyingImag = (doc) => {
  if (!doc.image) return;

  doc.image = `${process.env.BASE_URL}/categories/${doc.image}`;
  return doc;
};

brandSchema.post("init", modifyingImag);
brandSchema.post("save", modifyingImag);

// 2- Create model
const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
