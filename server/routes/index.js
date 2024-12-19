const customerRoute = require("../components/customer/route/customer");
const productRoute = require("../components/product/route/product");
const { verifyToken } = require("../middleware/JWTAction");
const { authenticateGoogle, handleGoogleCallback } = require('../middleware/GoogleOAuth');

function route(app) {
  app.get('/auth/google', authenticateGoogle);
  app.get('/auth/google/callback', handleGoogleCallback);
  app.get("/", (req, res) => {
    res.send("Hello from Express!");
  });
  app.use("/customer", customerRoute);
  app.use("/product", productRoute);

  // Secret route
  app.get("/protectiveroute", verifyToken, (req, res) => {
    res.json({ message: `Success` });
  });
}

module.exports = { route };
