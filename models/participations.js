const mongoose = require("mongoose")
const uuid = require('uuid');


const ParticipationSchema = new mongoose.Schema({
    room_id: { type: String, required: true, unique: true, default: "participation_" + uuid.v4() }, //change uuid
    user_id: { type: String, required: true },
    score: { type: Number },
}, {
    collection: "participations",
    timestamps: true
})


const model = mongoose.model("ParticipationModel", ParticipationSchema)

module.exports = model 