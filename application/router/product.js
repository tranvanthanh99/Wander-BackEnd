var express = require("express");
var productService = require("../../domain/services/productService");
var router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await productService.getAllProduct();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
});

router.get("/browse", async (req, res) => {
  // tags=rolex,day-date,style|pilot
  // tags=nike&productCategory=sneakers&size=5&gender=men&year=2020&price=<100,150-200,>800&offset=0&limit=10&sort=most-popular
  const { productCategory, gender, size, price, tags, year, sort, limit, offset, admin } = req.query;
  
  try {
    const result = await productService.getFilteredProduct({ productCategory, gender, size, price, tags, year, sort }, offset, limit, admin);
    res.status(200).json(result);
  } catch (err) {
    console.error(err)
    res.status(500).json({
      err: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await productService.getProduct(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
});

router.get("/owner/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await productService.getAllProductOfOwner(id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
});


router.post("/createProduct", async (req, res) => {
  const productOps = {};
  for (const [key, value] of Object.entries(req.body.productData)) {
    productOps[key] = value;
  }
  const { base64EncodedImage, ...otherOps } = productOps
  // console.log(otherOps)
  try {
    const newProduct = await productService.createProduct(otherOps, base64EncodedImage);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json({
      err: err.message,
    });
  }
});

router.post("/update/:productId", async (req, res) => {
  const { productId } = req.params;
  const updateOps = {};
  for (const [key, value] of Object.entries(req.body)) {
    updateOps[key] = value;
  }
  try {
    const updatedProduct = await productService.updateProduct(productId, updateOps);
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400);
    res.json({
      err: err.message,
    });
  }
});

router.delete("/delete/:productId", async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await productService.deleteProduct(productId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
});

module.exports = router;
