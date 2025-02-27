 const IORedis = require('ioredis')
 
 const RedisManager = new IORedis({maxRetriesPerRequest: null },
       'rediss://default:AVNS_0WDCTxpoCRCt-oTO-e_@caching-8d0912f-testtust21-e578.h.aivencloud.com:11860'
        // {
        //         port:15933,
        //         host:'redis-15933.c334.asia-southeast2-1.gce.redns.redis-cloud.com',
        //         username:'default',
        //         password:'Ke91uSFazEiqq4J0sXmVGhPg4PNYEtEt',
                
        // }
 )
module.exports= RedisManager;

