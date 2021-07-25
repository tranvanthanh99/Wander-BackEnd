var Order = require("../models/order.js");

const orderService = {
  getAllOrderOfOwner: async (donatorId) => {
    if (!(typeof donatorId === "string" || donatorId instanceof String)) {
      throw new Error("error/INVALID_ID");
    }
    let result = await Order.find({ donatorId }).exec();
    if (result) {
      return { orders: result };
    } else {
      throw new Error("error/ORDER_NOT_FOUND/WRONG_ID");
    }
  },
  getAllOrder: async () => {
    let result = await Order.find();
    if (result && result.length != 0) {
      return result;
    } else {
      throw new Error("error/CANNOT_GET_ALL/UNIDENTIFY_ERROR");
    }
  },
  getWithQuery: async (query) => {
    let result = await Order.find(query);
    console.log(query)
    if (result && result.length != 0) {
      return result;
    } else {
      throw new Error("error/CANNOT_GET_ALL/UNIDENTIFY_ERROR");
    }
  },
  createOrder: async (OrderOps) => {
    if (
      OrderOps["donatorId"] &&
      OrderOps["productId"] &&
      OrderOps["productName"]
    ) {
      const newOrder = Order(OrderOps);
      await newOrder.save();
      return newOrder;
    } else {
      throw new Error("error/ORDER_LACK_INFO");
    }
  },
};

module.exports = orderService;
