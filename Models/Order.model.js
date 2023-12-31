const mongoose = require("mongoose");


const order = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    Products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },

        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    status: {
      type: String,
      enum: ["in progress", "canceled", "out for delivery", "delivered"],
      default: "in progress",
    },
    paymentMethod: {
      type: String,
      enum: ["credit card", "cash on delivery"],
      required: true,
    },

    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    Note: {
      type: String,
    },
    ShippingFees: {
      type: Number,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      code: {
        type: String,
      },
      percentage: {
        type: Number,
      },
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", order);

module.exports = Order;
