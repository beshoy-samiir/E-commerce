const productModel = require("../../Models/Product.model");
const categoryModel = require("../../Models/Category.model");

class Product {
  static addProduct = async (req, res) => {
    try {
      let cat = await categoryModel.findOne({
        name: req.body.category,
      });

      req.body.category = cat.name;

      // req.body.brand = (await brandModel.findOne({ name: req.body.brand }))._id;
      const product = await new productModel(req.body);
      if (req.body.subCategory) {
        product.subCategory = req.body.subCategory;
      }
      await product.save();
      res.status(200).send(product);
    } catch (e) {
      res.status(400).send(e.message);
    }
  };


  static updateProduct = async (req, res) => {
    try {
      const product = await productModel.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { runValidators: true }
      );

      await product.save();
      res.status(200).send(product);
    } catch (e) {
      res.status(400).send(e.message);
    }
  };

  static deleteProduct = async (req, res) => {
    try {
      const result = await productModel.findByIdAndDelete(req.params.id);
      if (!result) {
        res.status(404).send("Product not found");
        return;
      }
      res.status(200).send();
    } catch (e) {
      res.status(400).send(e.message);
    }
  };
  static ChangeShowingProduct = async (req, res) => {
    try {
      const product = await productModel.findByIdAndUpdate(req.params.id, {
        showStatus: req.body.showStatus,
      });
      res.send(product);
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  static Allproducts = async (req, res) => {
    try {
      let products = await productModel.find();
      res.status(201).send(products);
    } catch (e) {
      res.status(400).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };

  static GetOneProduct = async (req, res) => {
    try {
      const product = await productModel.findById(req.params.id);

      res.send(product);
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

}

module.exports = Product;
