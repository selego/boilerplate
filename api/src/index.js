require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
require("./mongo");

const { PORT } = require("./config.js");

const app = express();

const origin = ["http://localhost:8083"];
app.use(cors({ credentials: true, origin }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(__dirname + "/../public"));

app.use("/user", require("./controllers/user"));

console.log("RUNNING ON 1", PORT);
const d = new Date();
console.log(d.toLocaleString());

app.get("/", async (req, res) => {
  const d = new Date();
  res.status(200).send("COUCOU " + d.toLocaleString());
});

require("./passport")(app);

app.listen(PORT, () => console.log("Listening on port " + PORT));
