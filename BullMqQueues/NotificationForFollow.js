const {Queue} =require('bullmq')
const RedisManager = require('../RedisConnection/RedisConnection')
const NotificationForFollow = new Queue('notificationforfollow',{
    connection:RedisManager});

module.exports = NotificationForFollow;