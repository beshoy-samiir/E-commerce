const returnModel = require("../../Models/Return.Model");
const order = require( "../User/Order.controller" );
class Return {
  static changeRequestStatus = async (req, res) => {
    try {
      const prevrequests = await returnModel.findByIdAndUpdate(req.params.id,{
        Status:req.body.Status,
        Returned:req.body.Returned,
        Responsemessage: req.body.Responsemessage
      }, {
        returnDocument: "after",
      })

     

     
      res.send();
    } catch (error) {
      res.send({
        ApiStatus: false,
        message: error.message,
      });
    }
  };
  static GetALLRequests = async (req, res) => {
    try {
      const usersRequests = await returnModel.find().populate({
        path: "UserID",
        strictPopulate: false,
        select: "name number email",
      })
      .populate({
        path: "ItemID",
        strictPopulate: false,
        select:
          "name description Discount price priceAfterDecount images category subCategory ",
      });
      res.send(usersRequests);
    } catch (error) {
      res.send({
        ApiStatus: false,
        message: error.message,
      });
    }
  };

}

module.exports = Return;
