# rooms_management_codeground
 *knock* *knock* Room service ?
 
### Creating a new room 
POST http://localhost:4001/rooms/create
```javascript
body 
{
    "challenge_type": "data-structures",
    "strategy": "FASTEST",
    "timer": 60,
    "socket_id": "socket9787"
}
```
returns in the best case scenario :
```javascript
{
  "status": "success",
  "message": "User joined",
  "data": {
    "room_id": "l3ybfg0l",
    "creator_id": "s22",
    "challenge_id": "62967569013c3f4514049c0a",
    "category_id": "data-structures",
    "timer": 60,
    "strategy": "FASTEST",
    "_id": "6299e528871a76dfff5174d8",
    "__v": 0
  }
}
```

### Submitting code in a room
POST http://localhost:4001/rooms/submit
```javascript
body 
{
    "challenge_id": "b55",
    "room_id": "room1",
    "code": "def add(a,b): return (a+b)",
    "language": "python"
}
```
returns in the best case scenario :
```javascript
{
  "status": "ok",
  "message": "room leaderboard changed"
}
```

## Example of a socket client
```javascript
#!/usr/bin/env node
const socket = require("socket.io-client")('http://localhost:4001/');


// Joining a room 
const data = {
    user_id: "userid1",
    room_id: "room1"
}
socket.on('connect', function() {
    console.log('connected...', socket.id);
    socket.emit("join", data); // When I receive this in rooms management, I'll call "socket.join(data.room_id);" and add the user to the Participations collection
    // Now this user is included in the room identified by "room1" 
});

// socket.on("joined", data => {
//     console.log("joined");
// })

socket.on("user joined", data => {
    // This event is triggered when someone else joins the room that you're in, we'll need this for the real-time waiting room
    console.log('one new user joined');
    console.log(data);
})

socket.on("user left", data => {
    // Same thing as the previous one but for user departure
    console.log('one user left');
    console.log(data);
})

socket.on("users", data => {
    // An update on the connected users list 
    console.log(data);
})

socket.on("leaderboard", leaderboard => {
    // The event is triggered when the leaderboard is updated, each socket receives only the leaderboard for the room that it's in (This is handled on my side)
    // Other rooms don't receive anything
    console.log(leaderboard)
}
)

socket.onAny((event, ...args) => {
    //Just to monitor every event that might happen, comment it if it gets too much x)
    console.log(event, args);
});


```
