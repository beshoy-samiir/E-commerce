const productModel = require("../../Models/Product.model");
const fs = require("fs");
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
  static uploadProductImages = async (req, res) => {
    try {
      let paths =[]
      let product = await productModel.findOne({ _id: req.params.id });
      req.files.forEach((element) => {
        let path = element.path;
        console.log(element.path)
        paths.push(`http://localhost:4000/${element.path}`)
        product.images.push({ image: path });
      });

      await product.save();
      
        res.json({
          success: 1,
          profile_url: paths
      })
 
    } catch (e) {
      res.send({
        apiStatus: false,
        data: e.message,
      });
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
      res.send(error.message);
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
      res.send(error.message);
    }
  };
  static getAllImagesOfProduct = async (req, res) => {
    try {
      const product = await productModel.findById(req.params.id);

      res.send(product.images);
    } catch (error) {
      res.send(error.message);
    }
  };
  static deleteImage = async (req, res) => {
    try {
      const product = await productModel.findById(req.params.id);
      await fs.unlink(req.body.ImageURL, function (err) {
        if (err) {
          throw new Error(err);
        }
      });
      let index = 0;
      product.images.forEach(async (element) => {
        console.log(element.image);
        console.log(req.body.ImageURL);

        if (element.image == req.body.ImageURL) {
          await product.images.pop(index);
          await product.save();
        }
        index = +1;
      });
      res.send(product);
    } catch (error) {
      res.send(error.message);
    }
  };
}

module.exports = Product;
