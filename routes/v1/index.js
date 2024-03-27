const express = require("express");

const welcome = require("./welcome");
const app = express();
const admin = require('./admin');
const user = require('./user');
const wallet = require('./wallet');


app.use("/welcome", welcome.welcome);
app.use("/admin", admin);
app.use("/user", user);
app.use("/wallet", wallet);

module.exports = app;
