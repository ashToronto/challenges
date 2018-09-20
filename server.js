const express         = require("express");
const PORT            = 8080;
const bodyParser      = require("body-parser");
const cookieSession   = require("cookie-session");
const bcrypt          = require('bcryptjs');
const app             = express();


app.set("view engine", "ejs");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

//Cookie sessions
app.use(cookieSession({
 name: 'session',
 keys: ['hothot'],
}))

// Serve css files
app.use(express.static(__dirname + '/stylesheets'));

// Seperated Routes for each Resource
const clientsRoutes = require("./routes/clients.js");
const adminRoutes = require("./routes/admin.js");

// Welcome page to direct shoppers and business owners
app.get("/", (req, res) => {
  res.render("welcome");
});

//Mounting Routes
app.use("/clients", clientsRoutes());
app.use("/admin", adminRoutes());

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
