const express = require("express");
const session = require("express-session");
const { connectToMongoDB } = require("./config/database");

const routes = require("./routes/routes");

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "grupp7",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/", routes);

connectToMongoDB();

module.exports = app;
