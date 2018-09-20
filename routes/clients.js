const express         = require("express");
const router          = express.Router();

module.exports = () => {

  router.get("/shoppers", (req, res) => {
    res.render("clients");
  });

  return router;
}
