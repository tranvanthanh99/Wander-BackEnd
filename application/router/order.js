var express = require("express");
var orderService = require("../../domain/services/orderService");
var auth = require("../../config/auth");
var router = express.Router();

router.post("/createOrder", async (req, res) => {
  const orderOps = {};
  for (const [key, value] of Object.entries(req.body)) {
    orderOps[key] = value;
  }
  console.log(orderOps)
  try {
    const newOrder = await orderService.createOrder(orderOps);
  res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json({
      err: err.message,
    });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { type } = req.query;
  try {
    let result;
    if (type === "all")
      result = await orderService.getWithQuery({
        donatorId: userId,
        receiverId: userId,
      });
    else if (type === "receiver") {
      result = await orderService.getAllOrderOfOwner({
        receiverId: userId,
      });
    } else {
      result = await orderService.getAllOrderOfOwner({
        donatorId: userId,
      });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
});

module.exports = router;
