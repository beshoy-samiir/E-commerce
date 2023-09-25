const productModel = require("../../Models/Product.model");
const cartModel = require("../../Models/Cart.model");
class BuyProduct {
  static creatNewCart = async (userId, cart) => {
    if (!cart) {
      cart = await new cartModel({
        userId: userId,
        Products: [],
        subtotal: 0,
      });
    }
    await cart.save();

    return cart;
  };
  static calculateSubtotal = async (cart) => {
    let subtotal = 0;
    // Itrate over the request items
    for (let item of cart.Products) {
      let product = await productModel.findById(item.productId);
      if (product.priceAfterDecount > 0) {
        subtotal += product.priceAfterDecount * item.quantity;
      } else {
        subtotal += product.price * item.quantity;
      }
    }
    return subtotal;
  };
  static modifyCart = async (userId, requestItems) => {
    try {
      // Find user cart
      let cart = await cartModel.findOne({ user_id: userId });

      // If the user doesn't have cart, create new one
      if (!cart) {
        cart = await this.creatNewCart(userId, cart);
        cart.subtotal = 0;
      }

      // Itrate over the request items
      for (let item of requestItems) {
        let product = await productModel.findById(item.productId);
        // Add product to cart only if product is present on database
        if (product) {
          // Search for product on cart
          let itemIndex = await cart.Products.findIndex(
            (p) => p.productId == item.productId
          );
          // If product is already on cart, update its quantity
           if (item.quantity > product.quantity) {
            item.quantity = product.quantity;
          }
          if (itemIndex > -1) {
            let productItem = cart.Products[itemIndex];

            productItem.quantity = item.quantity;
            cart.Products[itemIndex] = productItem;

            // Otherwise, add product to cart
          } else {
            cart.Products.push({
              productId: item.productId,
              quantity: item.quantity,
            });
          }
        } else {
          throw new Error("Product not deleted");
        }

        // Return cart
      }

      cart.subtotal = await this.calculateSubtotal(cart);
      console.log(cart);
      await cart.save();
      return cart;
    } catch (e) {
      return e.message;
    }
  };
  static addtoCart = async (req, res) => {
    try {
      let items = [];
      req.body.forEach((element) => {
        items.push({ productId: element, quantity: 1 });
      });
      console.log(items);
      const cart = await this.modifyCart(req.user._id, items);

      res.status(201).send("added");
    } catch (e) {
      res.status(400).send(e.message);
    }
  };
  static showCart = async (req, res) => {
    try {
      let cart = await cartModel.findOne({ userId: req.user._id });

      if (!cart) {
        cart = await this.creatNewCart(req.user._id, cart);
      }

      let products = [];

      if (cart) {
        for (let element in cart.Products) {
          let product = await productModel.findById(
            cart.Products[element].productId
          );

          if (cart.Products[element].quantity == 0 && product.quantity > 0) {
            cart.Products[element].quantity = 1;
            await cart.save();
          }
          product.quantity = cart.Products[element].quantity;
          products.push(product);
        }
      }
      let result =[]
      result.push({"products":products ,"subtotal":cart.subtotal})
   
      res.send(result[0]);
    } catch (e) {
      res.status(400).send({
        apistatus: false,
        message: e.message,
      });
    }
  };
  static RemoveAll = async (req, res) => {
    try {
      let usercart = await cartModel.findOne({ userId: req.user._id });
      usercart = {
        userId: req.user._id,
        Products: [],
        subtotal: 0,
      };
      res.status(200).send();
    } catch (e) {
      res.status(400).send(e.message);
    }
  };
  static RemoveFromCart = async (req, res) => {
    try {
      let cart = await cartModel.findOne({ userId: req.user._id });

      let index = cart.Products.findIndex((object) => {
        return object.productId == req.params.id;
      });
      if (index >= 0) {
        cart.Products.splice(index, 1);
      }

      await this.calculateSubtotal(cart).then((value) => {
        cart.subtotal = value;
      });
      await cart.save();
      res.status(200).send();
    } catch (e) {
      res.status(400).send({
        apistatus: false,
        message: e.message,
      });
    }
  };
}
module.exports = BuyProduct;
/*  userId: userId,
      Products: [],
      subtotal: 0,*/
