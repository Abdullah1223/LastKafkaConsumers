const express = require('express')
const os  = require('node:os').availableParallelism()
const cluster = require('node:cluster')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieparser = require('cookie-parser')
const conn = require('./Connection')
const { connection } = require('./KafkaConnection/KafkaConnection')
const CompetitionConsumer = require('./KafkaConsumers/CompetitionConsumer')
const CompetitionNotificationWorker = require('./BullMqWorkers/CompetitionNotificationWorker')
const AddingFollowingKafkaWorker = require('./KafkaConsumers/AddingFollowingKafkaWorker')
const NotificationForFollow = require('./BullMqQueues/NotificationForFollow')
const ForFollowWorker = require('./BullMqWorkers/ForFollowWorker')
const MessageDeliveredConsumer = require('./KafkaConsumers/MessageDeliveredConsumer')
const profileUpdateConsumer = require('./KafkaConsumers/profileUpdateConsumer')
const profileUpdateConsumerMainFunc = require('./KafkaConsumers/profileUpdateConsumer')
const MessageModificationConsumer = require('./KafkaConsumers/MessageModificationConsumer')
const CompetitionCategoryTrending = require('./KafkaConsumers/CompetitionCategoryTrending')
const EmailConsumer = require('./KafkaConsumers/EmailConsumer')
const EmailQueueWorker = require('./BullMqWorkers/EmailQueueWorker')
dotenv.config()
conn(process.env.MONGODBURI)


if(cluster.isPrimary){
    for(i=0;os>i;i++){
        cluster.fork()
    }
}else{

  const app = express()

   connection()
   CompetitionConsumer()
   CompetitionNotificationWorker()
   AddingFollowingKafkaWorker()
   ForFollowWorker();
   MessageDeliveredConsumer()
   profileUpdateConsumerMainFunc()
   MessageModificationConsumer()
   CompetitionCategoryTrending()
   EmailConsumer()
   EmailQueueWorker()
  app.listen(8006,()=>{console.log('Consumers Are Running On Port 8006')})

}