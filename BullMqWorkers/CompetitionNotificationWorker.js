const {Worker} = require('bullmq');
const RedisManager = require('../RedisConnection/RedisConnection');
const { default: mongoose } = require('mongoose');
const UserManager = require('../models/UserSchema');
const { RedisPublisher } = require('../RedisConnection/ForPubSub');



const CompetitionNotificationWorker = async()=>{
 

    const Working = new Worker('competitionnotificationqueue',async(job)=>{

        try{
            const {Notification} = job.data
            const {CreatorId} = job.data  
              const NotificationGenerated = {
               Notification:Notification,
               timestamp:Date.now(),
               NotificationType:'CompetitionCreation'
              }
            const UpdatingDatabase =await UserManager.findByIdAndUpdate({_id:CreatorId},{
               $push:{
                   'Notifications.ActiveNotifications':NotificationGenerated
               }
   
            })
            const lastNotification = UpdatingDatabase?.Notifications?.ActiveNotifications.slice(-1)[0];
            // console.log("This is Notification Database " + lastNotification) 
            if(UpdatingDatabase){
               const PublishingValues = {
                _id:lastNotification._id.toString(),
                   Notification,
                   CreatorId,
                   NotificationType:'CompetitionCreation'
               }
               const PublishingToRedis = await RedisPublisher.publish('CompetitionCreatedNotification',JSON.stringify(PublishingValues))
            }
        }catch(err){
            console.log(err)
        }

        },
    {connection:RedisManager}

)



}

module.exports = CompetitionNotificationWorker;