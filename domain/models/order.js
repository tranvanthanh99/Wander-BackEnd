const mongoose = require("../../infrastructure/db");
var Schema = mongoose.Schema;

const OrderSchema = new Schema({
    donatorId: String,
    receiverId: String,
    productId: String,
    productName: String,
    orderDate: Date,
    shipDate: Date,
    quantity: Number,
    donate: String,
    status: String //Shipping, Received
});

const Order = mongoose.model("order", OrderSchema);

module.exports = Order;