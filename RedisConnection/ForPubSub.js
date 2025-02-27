const IORedis = require('ioredis')
const RedisPublisher = new IORedis(
  'rediss://default:AVNS_0WDCTxpoCRCt-oTO-e_@caching-8d0912f-testtust21-e578.h.aivencloud.com:11860'
);


// Singleton Redis subscriber

const RedisSubscriber = new IORedis(
  'rediss://default:AVNS_0WDCTxpoCRCt-oTO-e_@caching-8d0912f-testtust21-e578.h.aivencloud.com:11860'
);
module.exports = {RedisPublisher,RedisSubscriber}