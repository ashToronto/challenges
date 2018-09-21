const express = require("express");
const router = express.Router();

const database = [];

module.exports = () => {

  router.get("/shoppers", (req, res) => {
    const templateVars = {
      database: database
    };
    console.log("Received ITEMS GET:  " + database.length)
    res.render("clients", templateVars);
  });

  router.post("/shoppers", (req, res) => {

    const itemName = req.body.item_name
    const item_price = req.body.item_price
    const photo_url = req.body.photo_url
    const description = req.body.description
    database.push({
      itemName: itemName,
      item_price: item_price,
      photo_url: photo_url,
      description: description
    })

    const templateVars = {
      database: database,
    }
    console.log("RECEIVED POST: " + database[0].items + " DATABASE LENGTH: " + database.length)
    res.render("clients", templateVars);
  });

  return router;
}
