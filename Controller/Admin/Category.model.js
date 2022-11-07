const categoryModel = require("../../Models/Category.model");
const productmodel = require("../../Models/Product.model");
class Category {
  static addCategory = async (req, res) => {
    const category = await categoryModel(req.body);
    try {
      await category.save();

      res.status(201).send();
    } catch (e) {
      res.status(400).send(e.message);
    }
  };
  static addSubCategory = async (req, res) => {
    try {
      const category = await categoryModel.findById(req.params.id);
      let subcat = { subCategory: req.body.subCategoryName };
      if (category) {
        await category.subCategoies.push(subcat);
        await category.save();
      } else {
        throw new Error("category not found");
      }

      res.status(201).send();
    } catch (e) {
      res.status(400).send(e.message);
    }
  };

  static DeleteSubCategory = async (req, res) => {
    try {
      const category = await categoryModel.findOne({ name: req.params.id });
      let subcat = category.subCategoies.filter(
        (e) => e.subCategory != req.body.subCategoryName
      );
      if (category) {
        category.subCategoies = subcat;
        await category.save();
      } else {
        throw new Error("category not found");
      }

      res.status(201).send("deleted");
    } catch (e) {
      res.status(400).send(e.message);
    }
  };
  static getsubCategory = async (req, res) => {
    try {
      const category = await categoryModel.findById(req.params.id);
      req.params.id = "";
      res.status(201).send(category.subCategoies);
    } catch (e) {
      res.status(400).send(e.message);
    }
  };

  static getCategory = async (req, res) => {
    try {
      const category = await categoryModel.find();

      res.status(201).send(category);
    } catch (e) {
      res.status(400).send(e.message);
    }
  };

  static getOneCategory = async (req, res) => {
    try {
      const category = await categoryModel.findById(req.params.id);
      res.status(201).send(category);
    } catch (e) {
      res.status(400).send(e.message);
    }
  };

  static updateCategory = async (req, res) => {
    try {
      const oldcategory = await categoryModel.findById(req.params.id);
      const brand = await categoryModel.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        {
          returnDocument: "after",
        }
      );
      const product = await productmodel.updateMany(
        { category: oldcategory.name },
        { $set: { category: brand.name } }
      );
      res.status(200).send(brand);
    } catch (e) {
      res.status(400).send(e.message);
    }
  };

  static deleteCategory = async (req, res) => {
    try {
      const oldcategory = await categoryModel.findById(req.params.id);
      if (!oldcategory) {
        res.status(200).send({ data: "Category not found" });
        return;
      }
      const product = await productmodel.find({ category: oldcategory.name });
      if (product.length != 0) {
        res.status(200).send({
          data: "There are products using this category , can't delete it",
        });

        return;
      }
      const result = await categoryModel.findByIdAndDelete(req.params.id);
      if (!result) {
        res.status(200).send({ data: "Category not found" });
        return;
      }
      res.status(200).send();
    } catch (e) {
      res.status(400).send(e.message);
    }
  };
}

module.exports = Category;
