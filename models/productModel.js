const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "product must have a title"],
      minLength: [6, "product must have a title more then 6"],
    },
    slug: {
      type: String,
      required: true,
      lowerCase: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A product must have a description"],
      minLength: [20, "A product must have a description more then 200 char"],
    },
    quantity: {
      type: Number,
      required: [true, "A product must have quantity"],
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "A product must have price"],
    },
    priceDiscount: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "imageCover must be provided"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "A product must belong to category"],
    },
    subcategories: {
      type: [mongoose.Schema.ObjectId],
      ref: "subCategory",
    },
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "rating must be above or equal 1"],
      max: [5, "rating must be below or equal 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
