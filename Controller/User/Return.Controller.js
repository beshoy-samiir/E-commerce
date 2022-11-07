const returnModel = require("../../Models/Return.Model");
const orderModel = require('../../Models/Order.model')
class Return {
  static request = async (req, res) => {
    try {
      const prevrequests = await returnModel.findOne({
        UserID: req.user._id,
        ItemID: req.body.id,
      });
      
      if (prevrequests) {
        throw new Error(" You have made a request already ");
      }
      let boughtit = false;
      const orders = await orderModel
      .find({ userId: req.user._id, status: "delivered" })
      .populate({
        path: "Products.productId",
        strictPopulate: false,
      });

      let index=0
      orders.forEach(element => {
        element.Products.forEach(e => {
          
if(req.body.id==e.productId._id ) 
{
  boughtit = true
}     

});
        
       index =+1 
      });
      if(boughtit){
        const returnReq = await new returnModel({
          ItemID: req.body.id,
          UserID: req.user._id,
          Reason: req.body.Reason,
        }).save();
        res.send(returnReq);
      }
      else{
        throw new Error("user didn't buy this product")
      }
      
    } catch (error) {
      res.send({
        ApiStatus: false,
        message: error.message,
      });
    }
  };
  static TrackRequests = async (req, res) => {
    try {
      const userRequests = await returnModel.find({ UserID: req.user._id });
      res.send(userRequests);
    } catch (error) {
      res.send({
        ApiStatus: false,
        message: error.message,
      });
    }
  };
}
module.exports = Return;
