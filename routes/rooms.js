var express = require('express');
const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');
const axios = require("axios")

var roomsRouter = express.Router();
const Joi = require("joi")
const Room = require("../models/rooms")
const Participation = require("../models/participations")

const { authorize, roles } = require("../middlewares/authorize")


const lbInstance = require("./leaderboard");
const { notifyRoomOnScoreChange } = require("../sockets/socket");



/* GET rooms listing. */
roomsRouter.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// authorize([roles.User]),
roomsRouter.post("/create", async function (req, res) {

    const data = req.body
    const validator = Joi.object({
        challenge_type: Joi.string().required(),
        strategy: Joi.string().required(),
        timer: Joi.number().required()
    })

    const validationResult = validator.validate(data)
    if (!validationResult.error) {
        //Generate a unique link with uniqid
        const id = uniqid.time();
        //Get user id (this is the creator of the room)

        req.id = "s22"; //TEMP
        user_id = req.id;

        const { challenge_type, strategy, timer } = data

        //Bring id_challenge from content management
        challenge_id = get_random_challengeID()

        try {
            let room = await Room.create({
                room_id: id,
                creator_id: user_id,
                challenge_id: challenge_id,
                category_id: challenge_type,
                strategy: strategy,
                timer: timer
            })

            // let creator_socket = io.sockets.sockets.get(req.body.socket_id);
            // creator_socket.join(id);

            try {
                let participation = Participation.create({
                    room_id: id,
                    user_id: user_id,
                    score: 0
                })

                res.json({
                    status: "success",
                    message: "User joined",
                    data: room
                })
            } catch (e) {
                console.error(e)
                return res.status(500).json({
                    status: "error",
                    message: "Couldn't join the room"
                })
            }

        } catch (e) {
            console.error(e)
            res.status(500).json({
                status: "error",
                message: "Couldn't create the room"
            })
        }




    } else {
        res.status(500).json({
            status: "error",
            message: "validation error"
        })
    }

    // The creator needs to join the room



})

function get_random_challengeID(id_category) {

    //Call content management
    // Meanwhile 
    return "b55";

    const content_request_body = {
        "id_category": id_category,
    }

    const content_request_headers = {
        headers: { "Content-Type": "application/json" }
    };

    axios.post(process.env.CONTENT_ENDPOINT, content_request_body, content_request_headers)
        .then(resp => {
            //         resp={
            //             id_challenge : b9t6tres-hu56
            //         }
            return resp["id_challenge"]
        })
        .catch(err => {
            //sendResponse(res , 500 , false , err.message)
            return "b4-gjfgh"
        })

}


roomsRouter.get("/:id", function (req, res) {

    const validId = req.params.id.toLowerCase();

    const room = Room.findOne({ room_id: validId }).exec()
    if (!room) {
        return res.status(401).json({
            status: "error",
            message: `No room of id ${validId} was found`
        })
    }

    // room found
    // 

    //Get user id (this is the joiner of the room)
    req.id = "s24"; //TEMP
    user_id = req.id;

    try {
        let participation = Participation.create({
            room_id: validId,
            user_id: user_id,
            score: 0
        })

        res.json({
            status: "success",
            message: "User joined",
            data: room
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({
            status: "error",
            message: "Couldn't join the room"
        })
    }



})


roomsRouter.post("/submit", async function (req, res) {
    // Get data from request

    const data = req.body

    const validator = Joi.object({
        challenge_id: Joi.string().required(),
        room_id: Joi.string().required(),
        user_id: Joi.string().required(),
        code: Joi.string().required(),
        language: Joi.string().required(),

    })

    const validationResult = validator.validate(data)
    if (!validationResult.error) {

        req.id = "s22"; //TEMP
        user_id = req.id;

        const { challenge_id, room_id, user_id, code, language } = data

        axios.post(process.env.GRADING_API, {
            challenge_id: challenge_id,
            room_id: room_id,
            user_id: user_id,
            code: code,
            language: lang
        }).then(function (response) {
            // console.log(response.data);
            const { score } = response.data.score;
            const lb = lbInstance(room_id)
            // Update score

            lb.update({
                id: user_id,
                value: score
            })

            // Send leaderboard event to room
            const roomSize = io.sockets.adapter.rooms.get(room_id).size
            notifyRoomOnScoreChange(room_id, lb.top(roomSize))

            return res.json({
                status: "ok",
                message: "room leaderboard changed"
            })
        }).catch(function (error) {
            console.log(error);
            return res.status(500).json({
                message: "Can not submit code"
            })
        });


    } else {
        return res.status(500).json({
            status: "error",
            message: "validation error"
        })
    }

})

async function addNewParticipation(user_id, room_id) {

    let participation
    try {
        participation = await Participation.create({
            room_id: room_id,
            user_id: user_id,
            score: 0
        })

    } catch (e) {
        console.error(e)

    }

    return participation;
}


module.exports = {
    roomsRouter,
    addNewParticipation
};
