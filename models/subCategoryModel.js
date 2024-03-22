const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      minLength: 2,
      maxLength: 32,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must belong to a Category"],
    },
  },
  { timestamps: true }
);

// subCategorySchema.pre(/^find/, function (next) {
//   this.populate({ path: "category", select: "name" });

//   next();
// });

const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

module.exports = subCategoryModel;
