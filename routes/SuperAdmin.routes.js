const router = require("express").Router();
const SuperAdminAuth = require("../middleware/SuperAdmin");
const superAdminController = require("../Controller/SuperAdmin/Admin.controller");
const AdminProudectController = require("../Controller/Admin/Products.Controller");
const AdminCategoryController = require("../Controller/Admin/Category.model");
const AdminController = require("../Controller/Admin/Admin.controller");
const userController = require("../Controller/User/user.controller")
const shippingFees = require("../Controller/Admin/Shipping.controller");
const transactions = require("../Controller/Admin/transactions.controller");
const blockedUsers = require("../Controller/Admin/Blocking.controller");
//////////////////////////// Admin ///////////////////////////////////
router.post('/login',userController.login)
router.post("/AddAdmin", SuperAdminAuth, superAdminController.addAdmin);
router.post(
  "/UpdateAdmin/:id",
  SuperAdminAuth,
  superAdminController.UpdateAdmin
);

router.get("/AllAdmins", SuperAdminAuth, superAdminController.getALLAdmin);
/////////////////////////// Blocking User ////////////////////////////////////
router.post("/block/:id", SuperAdminAuth, blockedUsers.blockUser);
router.get("/getblockUsers", SuperAdminAuth, blockedUsers.getALlBlockedUsers);
///////////////////////// shiping ///////////////////////////////////////////
router.post("/getcities", SuperAdminAuth, shippingFees.GetAllCities);
router.get("/getCountries", shippingFees.GetCountries);
router.get(
  "/GetAllCitesWeShipTO",

  shippingFees.GetAllCitesWeShipTO
);
router.get("/citiesOfCountry/:id", shippingFees.getcitiesOfCountry);
router.post("/updateFess", SuperAdminAuth, shippingFees.updateFess);
router.post("/addCountry", SuperAdminAuth, shippingFees.AddCountryWithAllCites);
router.get("/allCountries", SuperAdminAuth, shippingFees.getAllCountrisInWorld);
router.post(
  "/addDiscount",
  SuperAdminAuth,
  superAdminController.addDiscountCode
);

module.exports = router;
