const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');

module.exports = () => {
  // ********************** LOCAL DATABASE ************************

  const userDatabase = {
    "userRandomId": {
      id: "saberID",
      username: "saber",
      email: "saber@example.com",
      password: "saber",
    }
  }

  const itemDatabase = {
    "itemRandomId": {
      userID: "",
      itemId: "",
      itemName: "",
      price: "",
      photo_url: "",
      description: ""
    }
  }
  // ********************** HELPERS ************************
  // This random string is used for create a random ID for user
  function randomString() {
    var generate = "";
    var randomChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i <= 6; i++) {
      generate += randomChar.charAt((Math.floor(Math.random() * randomChar.length)));
    }
    return generate;
  }

  // ********************** ALL AVAILABLE ADMIN PATHS - GET REQUESTS ************************

  // ADMIN PANEL HOME PAGE
  router.get("/panel", (req, res) => {
    if (req.session.user_id) {
      res.render("admin");
    } else {
      res.redirect("/")
    }
  });

  // ADMIN REGISTRATION
  router.get("/register", (req, res) => {
    res.status(200);
    res.render("register");
  });

  // ADMIN LOGIN
  router.get("/login", (req, res) => {
    res.render("login")
  });

  // CREATE ITEMS FOR CLIENT CATALOGUE AND UPDATE WITH ADMIN PANEL
  router.get("/add", (req, res) => {
    if (req.session.user_id) {
      const templateVars = {
        username: userDatabase[req.session.user_id],
        itemDatabase: itemDatabase[req.session.user_id]
      };
      res.render("create_item", templateVars);
    } else {
      res.redirect("/")
    }
  });

  // ADMIN ITEM MANAGEMENT EDITING
  router.get("/items", (req, res) => {
    if (req.session.user_id) {
      let userItemList = {};
      for (j in itemDatabase) {
        if (itemDatabase[j].userID === req.session["user_id"]) {
          userItemList[j] = itemDatabase[j];
        }
      }
      const templateVars = {
        username: userDatabase[req.session["user_id"]],
        items: userItemList
      };
      console.log(userDatabase + " " + itemDatabase)
      res.render("items_manager", templateVars)
    } else {
      res.redirect("/")
    }
  });

// ADMIN ITEM MANAGEMENT CREATING
  router.get("/items/:id", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/")
    } else if (req.session["user_id"] === itemDatabase[req.params.id].userID) {
      const templateVars = {
        items: itemDatabase,
        admin: req.params.id,
        user_session: req.session["user_id"],
      }

      res.render("admin_item_catelogue", templateVars)
    }
  });

  // ********************** REGISTRATION - POST REQUESTS  ************************

  router.post('/register', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password
    if (!req.body.email || !req.body.password) { // test  user or password is not empty
      res.status(400).send('Text field cannot be empty');
    } else {
      const newUserId = randomString(6);
      let userExist = false;
      // Search for corresponding user in local object
      for (let i in userDatabase) {
        if (userDatabase[i].email === req.body.email) {
          userExist = true;
        }
      }
      if (userExist) { // test with user exist or not.
        res.status(400).send('User exist. Choose another one.');
      } else {
        userDatabase[newUserId] = {
          id: newUserId,
          username: req.body.username,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10)
        }
        req.session.user_id = newUserId;
        console.log("USER CREATED: " + userDatabase[newUserId].id)
        res.redirect("items");
      }

    }
  });

  // ********************** LOGIN - POST  ************************

  router.post("/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    console.log(username + password)
    if (!username || !password) {
      res.status(400).send('Cannot leave empty fields');
    } else {
      for (i in userDatabase) {
        if (userDatabase[i].username === username && bcrypt.compareSync(password, userDatabase[i].password)) {
          req.session.user_id = i;
          console.log("LOGGED IN AS: " + i)
          res.redirect("items");
        }
      }
    }
  });

  // *********** LOGOUT - POST REQUEST  *************

  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect("/")
  })

  // *********** CREATING ITEMS FOR CLIENT CATELOGUE - POST REQUEST  *************
  // Add new menu items to user Admin panel and client shop
  router.post('/add', (req, res) => {
    if (req.session["user_id"] || !(itemDatabase[req.params.id])) {
      const randomID = randomString();
      itemDatabase[randomID] = {
        userID: req.session["user_id"],
        itemId: randomID,
        itemName: req.body.name,
        price: parseFloat(req.body.price),
        photo_url: req.body.photo_url,
        description: req.body.description
      }
      res.redirect("items/" + randomID);
    } else {
      res.redirect("login")
    }
  });



  // *********** ADMIN MANAGEMENT - DELETING ITEMS - POST REQUEST  *************
  router.post("/items/:id/delete", (req, res) => {
    if (req.session["user_id"]) {
      const id = req.params.id;
      const erase = itemDatabase[id].userID
      if (erase === req.session["user_id"]){
         delete itemDatabase[id]
         res.redirect('http://localhost:8080/admin/items')
      } else {
        res.redirect('http://localhost:8080/admin/items')
      }
    }else {
        res.redirect('/')
      }

  });

  return router;
}
