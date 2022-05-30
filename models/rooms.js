const mongoose = require("mongoose")
const uuid = require('uuid');


const RoomSchema = new mongoose.Schema({
    room_id: { type: String, required: true, unique: true, default: "room_" + uuid.v4() }, //change uuid
    creator_id: { type: String, required: true },
    challenge_id: { type: String, required: true },
    category_id: { type: String, required: true },
    start_time: { type: String },
    state : { type: String },
    timer: { type: Number, required: true },
    strategy: { type: String, required: true },
}, {
    collection: "rooms"
})


const model = mongoose.model("RoomModel", RoomSchema)

module.exports = model 