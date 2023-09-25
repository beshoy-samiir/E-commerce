const router = require("express").Router();
const AdminAuth = require("../middleware/adminAuth");
const AdminProudectController = require("../Controller/Admin/Products.Controller");
const AdminCategoryController = require("../Controller/Admin/Category.model");
const AdminController = require("../Controller/Admin/Admin.controller");

const shippingFees = require("../Controller/Admin/Shipping.controller");
const transactions = require("../Controller/Admin/transactions.controller");
const adminAuth = require( "../middleware/adminAuth" );
////////////////Login //////////////////////////////
router.post("/login", AdminController.login);
//////////////////////////// product ///////////////////////////////////

router.post("/AddProduct", AdminAuth, AdminProudectController.addProduct);

router.post(
  "/updateProduct/:id",
  AdminAuth,
  AdminProudectController.updateProduct
);
router.post(
  "/deleteProduct/:id",
  AdminAuth,
  AdminProudectController.deleteProduct
);
router.get("/products", AdminAuth, AdminProudectController.Allproducts);
router.get(
  "/SingleProduct/:id",
  AdminAuth,
  AdminProudectController.GetOneProduct
);
/////////////////////////// category ////////////////////////////////////////////

router.post("/AddCategory", AdminAuth, AdminCategoryController.addCategory);
router.post(
  "/UpdateCategory/:id",
  AdminAuth,
  AdminCategoryController.updateCategory
);
router.post(
  "/DeleteCategory/:id",
  AdminAuth,
  AdminCategoryController.deleteCategory
);
router.get("/GetCategories", AdminAuth, AdminCategoryController.getCategory);
router.get(
  "/GetCategory/:id",
  AdminAuth,
  AdminCategoryController.getOneCategory
);
router.post(
  "/AddSubCategory/:id",
  AdminAuth,
  AdminCategoryController.addSubCategory
);
router.post(
  "/DeleteSubCategory/:id",
  AdminAuth,
  AdminCategoryController.DeleteSubCategory
);
router.get(
  "/getSubCategory/:id",
  AdminAuth,
  AdminCategoryController.getsubCategory
);
///////////////////////// transaction ////////////////////////

router.get("/transactions", AdminAuth, transactions.getTransactions);

router.post("/upadteTransactions", AdminAuth, transactions.changeTransactionstatus);
router.post(
  "/ChangeShowingProduct/:id",
  AdminAuth,
  AdminProudectController.ChangeShowingProduct
);

module.exports = router;
