const router = require("express").Router();
const AdminAuth = require("../middleware/adminAuth");
const AdminProudectController = require("../Controller/Admin/Products.Controller");
const AdminCategoryController = require("../Controller/Admin/Category.model");
const AdminController = require("../Controller/Admin/Admin.controller");

const shippingFees = require("../Controller/Admin/Shipping.controller");
const transactions = require("../Controller/Admin/transactions.controller");
const blockedUsers = require("../Controller/Admin/Blocking.controller");
const upload = require("../middleware/uploadImage");
const request = require("../Controller/Admin/Return.controller");
const { products } = require("../data");
const adminAuth = require( "../middleware/adminAuth" );
// router.post("/profile", userController.uploadProfileImage);
////////////////Login //////////////////////////////
router.post("/login", AdminController.login);
//////////////////////////// product ///////////////////////////////////

router.post("/AddProduct", AdminAuth, AdminProudectController.addProduct);
router.post(
  "/productImage/:id",
  AdminAuth,
  upload.array("productImage"),
  AdminProudectController.uploadProductImages
);
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
router.post('/deleteImage/:id',adminAuth, AdminProudectController.deleteImage)
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
router.get("/return", AdminAuth, request.GetALLRequests);

router.post("/changeReturnReq", AdminAuth, request.changeRequestStatus);
router.post("/upadteTransactions/:id", AdminAuth, transactions.changeTransactionstatus);
router.post(
  "/ChangeShowingProduct/:id",
  AdminAuth,
  AdminProudectController.ChangeShowingProduct
);

module.exports = router;
/*"Name" : "sreham",
    "email" : "rehdamsmm@gmail.com",
    "password" :"12",
    "Age":"22",
    "Number": "+201126681992",
    "userRole" :"admin",
   "Reason":"Not wanted",
      "productId":"6303555eaf43b1690f9ef045",
      "showStatus":"private",
      "quantity":"2",
      "payment_method":"cash on delivery",
      "CountryCode":"IN",

          "Country":"Egypt",
          "City":"Giza",
          "Area":"Tagmoaa",
          "Street":"Street 90",
   "UserID":"62c49799bb9c66440f405c4b",
   "Responsemessage":"not an acceptable resaen",
    "reqID":"63009b9bff3ad06e1343299e",
    "price":"800",
    "name":"kids",
    "Size":"Small",
    "category":"kids"*/
