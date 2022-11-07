const order = require("../../Models/Order.model")
const users = require("../../Models/User.model")
class transactions {
 static getTransactions = async(req, res)=>{
    try {

        let orders = await order.find().populate({
            path: "userId",
            strictPopulate: false,
            select: "name number email",
          })
          .populate({
            path: "Products.productId",
            strictPopulate: false,
            select:
              "name description Discount Size price priceAfterDecount images category subCategory ",
          });
     
        res.status(200).send(orders)
    } catch (error) {
        res.send({
            apiStatus: false,
        message: error.message,
        })
    }
 }
 static changeTransactionstatus = async(req, res)=>{
    try {
        const transaction = await order.findByIdAndUpdate(req.params.id,{
            status:req.body.status,
           
          }, {
            returnDocument: "after",
          })
          res.send(transaction)
    } catch (error) {
      res.send(error.message)
    }
  }
 static getDeliverdOrders = async(req, res)=>{
    try {
        let AllDelivedTransactions = []
        let orders = await order.find();
        for(let element in orders){
            if(orders[element].status=='delivered'){
            let user = await users.findById(orders[element].userId)
            let oneOrder =orders[element]
            AllTransactions.push({user , oneOrder })
            }
        }
        res.status(200).send(AllDelivedTransactions)
    } catch (error) {
        res.send({
            apiStatus: false,
        message: error.message,
        })
    }
 }
}
module.exports = transactions;