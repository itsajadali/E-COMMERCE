const mongoose = require("mongoose");
// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Too short category name"],
      maxLength: [32, "Too long category name"],
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

// works on get request (it sends the document modifying the image)
categorySchema.post("init", modifyingImag);

// works on create request (it sends the document modifying the image)
categorySchema.post("save", modifyingImag);

// 2- Create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
