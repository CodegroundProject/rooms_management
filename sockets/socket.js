// const { server } = require("../bin/server")
const Timer = require('./models/room-timer');
let io;
function initSocketIO(server) {
    io = require("socket.io")(server, {
        cors: {
            origin: '*',
        },
    });



    // Note: Put any code that interacts with io directly here

    io.on("connection", (socket) => {

        console.log("hello")
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
        let timer = new Timer(updateTimerCallBack, room);
        timer.startTimer();
    });

    io.of("/").adapter.on("join-room", (room, id) => {
        console.log(`socket ${id} has joined room ${room}`);
    });

}




// Note: These functions are called with io != undefined

function updateTimerCallBack(roomid, time) {
    console.log(`emitting timer to ${roomid}`);
    io.to(roomid).emit('update timer', time);
}


const notifyRoomOnScoreChange = (roomId, leaderboard) => {
    io.to(roomId).emit("leaderboard", leaderboard);
}

module.exports = {
    io,
    initSocketIO,
    notifyRoomOnScoreChange
}