module.exports = function (app) {
  app.use("/product", require("./controllers/productController"));
  app.use("/cart", require("./controllers/cartController"));
  app.use("/order", require("./controllers/orderController"));
  app.use("/user", require("./controllers/userController"));
};
