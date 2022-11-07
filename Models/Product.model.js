const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    Discount: {
      type: Number,
      min: 0,
    },
    Status: {
      type: String,
      enum: ["In stock", "Out of Stock"],
      default: "In stock",
    },
    showStatus: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    priceAfterDecount: {
      type: Number,
    },
    images: [
      {
        image: {
          type: String,
        },
      },
    ],
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    Size: {
      type: String,
      enum: ["Small", "Medium", "large", "free size", "XL", "XXL", "XXXl"],
      required: true,
    },
    WashingInstructions: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      ref: "Category",
    },
    subCategory: {
      type: String,
    },
    addedToCart:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);
productSchema.pre("save", async function () {
  
  this.priceAfterDecount = await( (this.price) - ((this.Discount/100) * this.price));
  if(this.quantity<=0){
    this.Status = "Out of Stock"
  }else{
    this.Status = "In stock"
  }
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
