const productModel = require("../../Models/Product.model");
const cartModel = require("../../Models/Cart.model");
const orderModel = require("../../Models/Order.model");
const discountCode = require("../../Models/discountCode");

const shippingFees = require("../../Models/shippingFees.Models");
const { find } = require("../../Models/Product.model");
// to place an orden => Check if item still available ,  the quantity is okay , decrease the amount quantaty of this product , check the adress given
const discoutcheck = async (userid, code) => {
  try {
    let cart = await cartModel.findOne({ user_id: userid });

    if (code) {
      // check if code still have stock
      if (code.timeOfUse == 0) {
        throw new Error(" code not working anymore");
      }
      // check if subtotal have the min
      if (code.OnlyOnShipping) {
        return {
          price: cart.subtotal,
          codeName: code.name,
          shippingFees: 0,
        };
      }
      if (cart.subtotal >= code.minOrderPrice) {
        // check if percentage
        if (code.percentage) {
          cart.subtotal =
            cart.subtotal - (code.percentage / 100) * cart.subtotal;
        } else if (code.value) {
          cart.subtotal = cart.subtotal - code.value;
        }

        let index;

        code.Usage.forEach((element) => {
          if (element.userID.equals(userid)) {
            index = code.Usage.indexOf(element);
          }
        });
        if (index >= 0) {
          if (code.Usage[index].timeOfUse >= code.timeOfUseByoneUser) {
            throw new Error("You reach the max use of this code");
          } else {
            code.Usage[index].timeOfUse = code.Usage[index].timeOfUse + 1;
          }
        } else {
          code.Usage.push({ userID: userid, timeOfUse: 1 });
        }

        code.timeOfUse = code.timeOfUse - 1;
      } else {
        throw new Error("order should be more than ", code.minOrderPrice);
      }
    } else {
      throw new Error("code not avillable");
    }
    return {
      price: cart.subtotal,
      codeName: code.name,
      percentage: code.percentage,
    };
  } catch (error) {
    return { error: error.message };
  }
};
const CalculateShippingFess = async (Country, City, enteredCode) => {
  try {
    let fees;

    let shipping = await shippingFees.findOne({ Name: Country });
    for (let element in shipping.cities) {
      if (shipping.cities[element].Name == City) {
        fees = shipping.cities[element].fees;
      }
    }
    // check if user entered code to cancel shipping
    if (enteredCode) {
      let code = await discountCode.findOne({ name: enteredCode });

      if (code.OnlyOnShipping) {
        fees = 0;
      }
    }
    return fees;
  } catch (error) {
    return error.message;
  }
};
class order {
  static placeOrder = async (req, res) => {
    try {
      let cart = await cartModel.findOne({ user_id: req.user._id });
      console.log(cart.subtotal);
      // check if address is null
      if (req.body.address == "null" || req.body.address == null) {
        throw new Error("address is empty");
      }
      //IF CART EMPTY
      if (!cart) {
        throw new Error("Add Items To Placee an order");
      }

      // calculate shipping fees
      let fees = await CalculateShippingFess(
        req.body.country,
        req.body.city,
        req.body.code
      );

      let order = await new orderModel(req.body);
      order.userId = req.user._id;
      order.Products = cart.Products;
      order.subtotal = cart.subtotal;
      order.total = fees + order.subtotal;
      order.ShippingFees = fees;
      order.paymentMethod = req.body.paymentMethod;
      order.number = req.body.phoneNumber;
      // check discount
      console.log(cart.subtotal);
      console.log(order.subtotal);
      if (req.body.code) {
        var code = await discountCode.findOne({ name: req.body.code });
        let discountData = await discoutcheck(req.user._id, code);

        if (discountData.error) {
          throw new Error(discountData.error);
        }
        order.discount = {
          code: req.body.code,
          percentage: discountData.percentage,
        };
        if (discountData.shippingFees == 0) {
          order.ShippingFees = 0;
        } else {
          order.total = order.ShippingFees + discountData.price;
        }

        await code.save();
      }
      //taking info form user cart

      let index = 0;
      for (let element in cart.Products) {
        let product = await productModel.findById(
          cart.Products[element].productId
        );
        if (
          !product ||
          product.Status == "Out of Stock" ||
          product.showStatus == "private" ||
          product.quantity == 0
        ) {
          cart.Products.pop(index);
        }

        if (product.quantity == 0) {
          product.Status = "Out of Stock";
        } else {
          product.quantity = product.quantity - cart.Products[element].quantity;
        }
        index = +1;

        await product.save();
      }
      if (cart.Products.length == 0) {
        throw new Error(" all products not available");
      }
      order.Products = cart.Products;
      await order.save();
      console.log(await cartModel.deleteOne({ userId: req.user._id }));

      res.send();
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        data: e.message,
      });
    }
  };

  static AddressFees = async (req, res) => {
    try {
      let fees = await CalculateShippingFess(
        req.body.country,
        req.body.city,
        req.body.code
      );
      res.status(200).send(fees.toString());
    } catch (error) {
      res.status(400).send({
        apistatus: false,
        message: error.message,
      });
    }
  };
  static discount = async (req, res) => {
    try {
      let code = await discountCode.findOne({ name: req.body.code });

      let price = await discoutcheck(req.user._id, code);
      if (price.error) {
        throw new Error(price.error);
      }
      res.send({ price: price.price });
    } catch (e) {
      res.status(400).send({
        apistatus: false,
        message: e.message,
      });
    }
  };
  static getProd = async (order) => {
    let products = [];
    for (let element in order.Products) {
      let product = await productModel.findById(
        order.Products[element].productId
      );

      product.quantity = order.Products[element].quantity;
      products.push(product);
    }
    return products;
  };

  static NonDeliverdOrders = async (req, res) => {
    try {
      let Order = await orderModel
        .find({ userId: req.user._id })
        .where("status")
        .ne("delivered")

        .populate({
          path: "userId",
          strictPopulate: false,
          select: "Name Number email",
        })
        .populate({
          path: "Products.productId",
          strictPopulate: false,
          select:
            "name description Discount price priceAfterDecount images category subCategory ",
        });

      res.send(Order);
    } catch (e) {
      res.status(400).send({
        apistatus: false,
        message: e.message,
      });
    }
  };
  static allOrders = async (req, res) => {
    try {
      let Order = await orderModel
        .find({ userId: req.user._id })

        .populate({
          path: "userId",
          strictPopulate: false,
          select: "Name Number email",
        })
        .populate({
          path: "Products.productId",
          strictPopulate: false,
          select:
            "name description Discount price priceAfterDecount images category subCategory ",
        });

      res.send(Order);
    } catch (e) {
      res.status(400).send({
        apistatus: false,
        message: e.message,
      });
    }
  };
  static trackOrder = async (req, res) => {
    try {
      let order = await orderModel.find({
        userId: req.user._id,
        _id: req.params.id,
      });
      res.send(order);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        message: error.message,
      });
    }
  };
  static allProductUserBuy = async (req, res) => {
    try {
      let products = [];
      const orders = await orderModel
        .find({ userId: req.user._id, status: "delivered" })
        .populate({
          path: "Products.productId",
          strictPopulate: false,
        });

      let index = 0;
      orders.forEach((element) => {
        element.Products.forEach((e) => {
          products.push(e);
        });

        index = +1;
      });
      res.send(products);
    } catch (error) {
      res.status(400).send({
        apiStatus: false,
        message: error.message,
      });
    }
  };
}
module.exports = order;
/*const mongoose = require("mongoose");
const { stringify } = require("querystring");
const adress = require("../Models/Adderss");

const order = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
    payment_method: {
      type: String,
      enum: ["credit card", "cash on delivery"],
      required: true,
    },

    Country: {
      Type: String,
    },
    City: {
      type: String,
    },
    Area: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    Note:{
      type: String,
    },
    ShippingFees: {
      type: Number,
      required: true,

    },
    phoneNumber:{
      type: Number,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,

      
    }
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", order);

module.exports = Order;
*/

/* whan address added calculat total 
if compon code added calculate total 
whan place order calculate all again
*/
