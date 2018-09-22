const express = require("express");
const router = express.Router();

const database = [];

module.exports = () => {

  router.get("/shoppers", (req, res) => {
    const displayItems = {}

    for (i in database){
      if (database.length === i || database.length === 0){
        displayItems.push({
          itemId: database[i].itemId,
          itemName: database[i].item_name,
          item_price: database[i].item_price,
          photo_url: database[i].photo_url,
          description: database[i].description
        })
      }
    }

    const templateVars = {
      database: displayItems
    };
    console.log("Received ITEMS GET:  " + database.length)
    res.render("clients", templateVars);
  });

  router.post("/shoppers", (req, res) => {
    const itemName = req.body.item_name
    const item_price = req.body.item_price
    const photo_url = req.body.photo_url
    const description = req.body.description
    const itemId = req.body.itemId

        database.push({
          itemId: req.body.itemId,
          itemName: req.body.item_name,
          item_price: req.body.item_price,
          photo_url: req.body.photo_url,
          description: req.body.description
        })

    const templateVars = {
      database: database,
    }
    console.log("RECEIVED POST: " + database + " DATABASE LENGTH: " + database.length)
    res.render("clients", templateVars);
  });

  return router;
}
