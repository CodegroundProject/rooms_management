'use strict';

var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const { startHeartBeating } = require("./discovery/discovery")
var http = require('http');
var server = http.createServer(app);

const Timer = require('./models/room-timer');




var indexRouter = require('./routes/index');
var {roomsRouter, addNewParticipation} = require('./routes/rooms');

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

const io = require("socket.io")(server, {
    cors: {
        origin: '*',
    },
});


io.on("connection", (socket) => {


    socket.on("join", async (data) => {
        
        socket.join(data.room_id);

        //let participation = await addNewParticipation(data.user_id, data.room_id);
        console.log("join");
        console.log(data);

        console.log('new user joined');

        socket.to(data.room_id).emit("user joined", socket.id);

    })

    socket.on("leave", data => {

        console.log("leave");
        socket.to(data.room_id).emit("user left", socket.id);

    })

    socket.on("disconnect", () => {

        console.log("disconnect");
        // Get all room_id from participations where socket_id = socket.id
        socket.broadcast.emit("user left", socket.id);

    });

})

io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});


  
  
module.exports = {
    server,
    app
};
  