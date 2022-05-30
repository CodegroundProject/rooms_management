'use strict';

var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const { startHeartBeating } = require("./discovery/discovery")

var indexRouter = require('./routes/index');
var roomsRouter = require('./routes/rooms');

var app = express();
dotenv.config();

mongoose.connect("mongodb+srv://souaad:souaad@souaadcluster.0xben.mongodb.net/codeground--db?retryWrites=true&w=majority", {
    useNewUrlParser: true
}).then(() => {
    console.log("Connected to codeground--db")
}).catch(e => {
    console.error(e)
    process.exit(1)
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use('/', indexRouter);
app.use('/rooms', roomsRouter);

//startHeartBeating()

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
  });
  
  
module.exports = app;
  