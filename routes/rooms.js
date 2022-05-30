var express = require('express');
const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');

var router = express.Router();
const Joi = require("joi")
const Room = require("../models/rooms")
const Participation = require("../models/participations")

const { authorize, roles } = require("../middlewares/authorize") 

/* GET rooms listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

// authorize([roles.User]),
router.post("/create",  function (req, res) {

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
            let room = Room.create({
                room_id: id,
                creator_id: user_id,
                challenge_id: challenge_id,
                category_id: challenge_type,
                strategy: strategy,
                timer: timer
            })

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
    

            // res.json({
            //     status: "success",
            //     message: "Room created",
            //     data: room
            // })
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

    const content_request_body={
        "id_category" : id_category,
    }

    const content_request_headers = {
        headers : { "Content-Type": "application/json"}
    };

    axios.post(process.env.CONTENT_ENDPOINT  , content_request_body , content_request_headers )
        .then(resp=>{
    //         resp={
    //             id_challenge : b9t6tres-hu56
    //         }
            return resp["id_challenge"]
        })
        .catch(err=>{
            //sendResponse(res , 500 , false , err.message)
            return "b4-gjfgh"
        })

}


router.get("/:id", function (req, res) {
    
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



module.exports = router;
