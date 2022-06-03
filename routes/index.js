var express = require('express');
var indexRouter = express.Router();
const { authorize, roles } = require("../middlewares/authorize")


indexRouter.get('/', function (req, res, next) {
    res.send("You've reached the index!");
});

module.exports = {
    indexRouter
};