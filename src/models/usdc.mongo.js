const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const usdcSchema = new Schema({
    _usdcId: {required:true, type:String},
    type: {required:true, type:String},
    merchantId: {required:true, type:String},
    merchantWalletId:{required: true, type:String},
    sourceId: {required:true, type:String},
    description:{required:true, type:String},
    paymentDate: {required:true, type:Date},
    email: {required:true, type:String}
})