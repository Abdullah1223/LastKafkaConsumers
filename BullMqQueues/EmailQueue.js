const {Queue} =require('bullmq')
const RedisManager = require('../RedisConnection/RedisConnection')
const EmailQueue = new Queue('emailqueue',{
    connection:RedisManager});

module.exports = EmailQueue;