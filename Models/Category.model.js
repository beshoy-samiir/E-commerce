const mongoose = require("mongoose");

const categoryScehma = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    subCategoies: [
      {
        subCategory: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categoryScehma);

module.exports = Category;
