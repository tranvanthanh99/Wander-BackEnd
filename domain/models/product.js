const mongoose = require("../../infrastructure/db");
var Schema = mongoose.Schema;


var detail = new Schema({
  name: String,
  value: String,
})

var productSchema = new Schema({
  productName: String,
  description: String,
  imageurl: String,
  donator: {
    name: String,
    _id: String
  },
  detail: [detail],
  quantity: {
    init: Number,
    remain: Number,
  },
  location: {
    city: String,
    district: String
  },
  rating: Number,
  tags: [String],
  dateUpdated: { type: Date, default: Date.now }
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;