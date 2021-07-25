var Product = require("../models/product");

const productService = {
  getProduct: async (_id) => {
    if (!(typeof _id === "string" || _id instanceof String)) {
      throw new Error("error/INVALID_id");
    }
    let result = await Product.findOne({ _id });
    if (result) {
      return { product: result };
    } else {
      throw new Error("error/PRODUCT_NOT_FOUND/WRONG_ID");
    }
  },
  getAllProduct: async () => {
    let result = await Product.find();
    if (result && result.length != 0) {
      return result;
    } else {
      throw new Error("error/CANNOT_GET_ALL/UNIDENTIFY_ERROR");
    }
  },
  getFilteredProduct: async ({
    productCategory,
    gender,
    size,
    price,
    tags,
    year,
    sort
  }, offset = 0, limit = 20, admin) => {
    let andQueries = [];
    let sortQuery = {};
    for (const [key, value] of Object.entries({
      // productCategory,
      gender,
      size,
      price,
      tags,
      year,
      sort,
    })) {
      if (value != null) {
        if (key === "size")
          andQueries = [
            {
              sizeQuantity: {
                $elemMatch: { size: { $eq: value }, quantity: { $ne: 0 } },
              },
            },
            ...andQueries,
          ];
        else if (key === "price") {
          let priceQuery = [];
          value.split(",").map((i) => {
            if (i.includes("<"))
              priceQuery = [
                { [key]: { $lte: parseInt(i.replace("<", "")) } },
                ...priceQuery,
              ];
            else if (i.includes("-"))
              priceQuery = [
                {
                  $and: [
                    { [key]: { $gte: parseInt(i.split("-")[0]) } },
                    { [key]: { $lte: parseInt(i.split("-")[1]) } },
                  ],
                },
                ...priceQuery,
              ];
            else if (i.includes(">"))
              priceQuery = [
                { [key]: { $gte: parseInt(i.replace(">", "")) } },
                ...priceQuery,
              ];
          });
          andQueries = [{ $or: [...priceQuery] }, ...andQueries];
        } else if (key === "tags")
          andQueries = [{ tags: { $all: value.split(",") } }, ...andQueries];
        else if (key === "year") {
          let yearQuery = [];
          value.split(",").map((i) => {
            yearQuery = [
              {
                releaseDate: {
                  $gte: new Date(new Date(`${i}-1-1`)),
                  $lte: new Date(new Date(`${i}-12-31`)),
                },
              },
              ...yearQuery,
            ];
          });
          andQueries = [{ $or: [...yearQuery] }, ...andQueries];
        } else if (key === "sort") {
          if (value === "most-popular") sortQuery = { releaseDate: -1 };
          else if (value === "trending") sortQuery = { dateUpdated: -1 };
        } else andQueries = [{ [key]: value }, ...andQueries];
      }
    }
    const searchQueries = andQueries.length > 0 ? { $and: [...andQueries] } : {};
    console.log(searchQueries)
    const totalRecord = await Product.countDocuments(searchQueries);
    const result = await Product.find(searchQueries)
      .limit(parseInt(limit))
      .skip(parseInt(limit) * parseInt(offset))
      .sort(sortQuery);
    if (result) {
      return { totalRecord, result };
    } else {
      throw new Error("error/CANNOT_GET_FILTERED_PRODUCTS/UNEXPECTED_QUERIES");
    }
  },
  createProduct: async (ProductOps) => {
    if (
      ProductOps["productName"] 
    ) {
        const newProduct = Product(ProductOps);
        await newProduct.save();
        return newProduct;
      }
     else {
      throw new Error("error/PRODUCT_LACK_INFO");
    }
  },
  updateProduct: async (_id, updateOps) => {
    updateOps["dateUpdated"] = Date.now();
 
    let result = await Product.updateOne({ _id }, { $set: updateOps });
    if (result) {
      return result;
    } else {
      throw new Error("error/PRODUCT_NOT_FOUND/WRONG_ID");
    }
  },

  deleteProduct: async (_id) => {
    let result = await Product.deleteOne(
      { _id }
    );
    if (result) {
      return result;
    } else {
      throw new Error("error/PRODUCT_NOT_FOUND/WRONG_ID");
    }
  },
};

module.exports = productService;
