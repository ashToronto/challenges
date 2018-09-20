const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');

module.exports = () => {

  // ********************** LOCAL DATABASE ************************

  const userDatabase = {
    "randomID": {
      id: "saberID",
      username: "saber",
      email: "saber@example.com",
      password: "saber"
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

    // CREATE ITEMS FOR CLIENT CATALOGUE
    router.get("/add", (req, res) => {
      if (req.session.user_id) {
        res.render("create_item");
      } else {
        res.redirect("/")
      }
    });

    // ADMIN ITEM MANAGEMENT
    router.get("/items", (req, res) => {
        if (req.session.user_id) {
          res.render("admin_item_catelogue")
      } else {
        res.redirect("/")
      }
    });

  // ********************** REGISTRATION - POST REQUESTS  ************************

  router.post('/register', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password
    if (!req.body.email || !req.body.password) { // test with user or password is blank
      res.status(400).send(systemMessages('Blank cannot be used for user or password.'));
    } else {
      const newUserId = randomString(6);
      let userExist = false;
      // Search for corresponding user in local object
      for (let userId in userDatabase) {
        if (userDatabase[userId].email === req.body.email) {
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
        console.log("USER CREATED: " + userDatabase[newUserId])
        res.redirect("panel");
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
          console.log("LOGIN DETAILE: " + i)
          res.redirect("panel");
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
  // Add a new menu item
  router.post('/add', (req, res) => {
    res.status(200);
    const name = req.body.name;
    const description = req.body.description;
    const item_price = parseFloat(req.body.price);
    const photo_url = req.body.photo_url;
    console.log(name)

    res.redirect("panel");
  });

  return router;
}
