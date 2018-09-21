const express         = require("express");
const router          = express.Router();

module.exports = () => {

  router.get("/shoppers", (req, res) => {
    res.render("clients");
  });

  router.post("/shoppers", (req, res) => {
    const itemname = req.body.item_name
    const item_price = req.body.item_price
    const photo_url = req.body.photo_url
    const description = req.body.description

    console.log("RECEIVED POST: " + itemname)
    res.render("clients");
  });

  return router;
}
