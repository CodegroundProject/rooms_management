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

### 
