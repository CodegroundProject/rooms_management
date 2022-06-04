// const { server } = require("../bin/server")
const Timer = require('../models/room-timer');
const { instrument } = require("@socket.io/admin-ui")


let io;
function initSocketIO(server) {
    
    io = require("socket.io")(server, {
        cors: {
            origin: '*',
        },
    });

    instrument(io, {
        auth: false
    })

    // Note: Put any code that interacts with io directly here

    io.on("connection", (socket) => {

        console.log("hello");
        
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
        // console.log(io);
        let timer = new Timer(updateTimerCallBack, room);
        timer.startTimer();

    });

    io.of("/").adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
    });

    console.log("init socket io");
    // console.log(io);
}



// Note: These functions are called with io != undefined

function updateTimerCallBack(roomid, time) {
    // console.log(`emitting timer to ${roomid}`);
    io.to(roomid).emit('update timer', time);
}


const notifyRoomOnScoreChange = (roomId, leaderboard) => {
    console.log("leaderboard")
    console.log(leaderboard)
    io.to(roomId).emit("leaderboard", leaderboard);
}

function get_io() {
    return io;
}

module.exports = {
    get_io,
    io,
    initSocketIO,
    notifyRoomOnScoreChange
}