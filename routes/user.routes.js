const router = require("express").Router();
const auth = require("../middleware/auth");
const userController = require("../Controller/User/user.controller");
const upload = require("../middleware/uploadImage");
const buyProduct = require("../Controller/User/Cart.controller");
const favourite = require("../Controller/User/Favourite.controller");
const order = require("../Controller/User/Order.controller");
const Return = require("../Controller/User/Return.Controller");
const shippingFees = require("../Controller/Admin/Shipping.controller");

const { route } = require("./Admin.Routes");
const AdminProudectController = require("../Controller/Admin/Products.Controller");
const AdminCategoryController = require("../Controller/Admin/Category.model");
router.post(
  "/profile",
  auth,
  upload.single("profile"),
  userController.uploadProfileImage
);
 //router.post("/profile", userController.uploadProfileImage);
//////////////// user ////////////////////////////////////
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", auth, userController.logout);
router.get("/info", auth, userController.singleUser);
router.post("/deleteAccount", auth, userController.deleteSingleAcount);
router.post("/edit", auth, userController.edit);

//////////////////////////////// product and home page /////////////////////////////////////////
router.get("/SingleProduct/:id", AdminProudectController.GetOneProduct);
router.get("/GetCategories", AdminCategoryController.getCategory);
router.get("/GetCategory/:id", AdminCategoryController.getOneCategory);
router.get("/getSubCategory/:id", AdminCategoryController.getsubCategory);

router.get("/Home/product/:id", userController.OneProduct);
router.get("/recent", userController.getleastRel);
router.get("/AllProducts", userController.Allproducts);
router.get("/Home/sortedA", userController.sortAESC);
router.get("/Home/sortedD", userController.sortDESC);
router.get("/getproductbycategory/:id", userController.ChooseByCategory);
router.get("/getproductbySubcategory/:id", userController.ChooseBySubCategory);

////////////////////////// cart/////////////////////////////////////////
router.post("/add/cart", auth, buyProduct.addtoCart);
router.get("/show/cart", auth, buyProduct.showCart);
router.post("/removeAllcart", auth, buyProduct.RemoveAll);
router.post("/remove/cart/:id", auth, buyProduct.RemoveFromCart);
/////////////////// fav /////////////////////////////
router.get("/Favourite", auth, favourite.showFav);
router.post("/addToFav/:id", auth, favourite.addToFav);

///////////////////// return req /////////////////////////////////
router.post("/return", auth, Return.request);
router.get("/trackReq", auth, Return.TrackRequests);
router.post("/PlaceOrder", auth, order.placeOrder);
router.post("/addressFees", auth, order.AddressFees);
router.post("/discount", auth, order.discount);
router.get('/boughtProducts', auth , order.allProductUserBuy)
router.get("/citiesOfCountry/:id", shippingFees.getcitiesOfCountry);
router.get("/getCountries", shippingFees.GetCountries);

router.get("/trackorder/:id", auth, order.trackOrder);
router.get('/allNoneDeliverdOrder', auth, order.NonDeliverdOrders)
router.get('/allOrders', auth, order.allOrders)

//////////// reset password///////////////
router.post("/sendOTP", userController.SendOTP);
router.post("/EnterOtp/:id", userController.confiremOtp);
router.post("/resetPassword/:id", userController.ResetPassword);

////////////////// search /////////////////
router.post('/search', userController.search)










////////////////END////////////////////////////////
module.exports = router;
