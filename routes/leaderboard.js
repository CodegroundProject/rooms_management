const Redis = require('ioredis');
const { Leaderboard } = require('redis-rank');

const client = new Redis({
    host: "127.0.0.1",
    port: 6379
});

const instance = (lb_id) => {
    return lb = new Leaderboard(client, room_id, {
        sortPolicy: 'high-to-low',
        updatePolicy: 'replace'
    });
}


module.exports = instance