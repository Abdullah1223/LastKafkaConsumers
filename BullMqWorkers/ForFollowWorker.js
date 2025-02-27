const {Worker} = require('bullmq')
const RedisManager = require('../RedisConnection/RedisConnection')
const UserManager = require('../models/UserSchema')
const { RedisPublisher } = require('../RedisConnection/ForPubSub')


const ForFollowWorker=async()=>{
  
    const  worker = new Worker('notificationforfollow',async(job)=>{
        console.log(job.data)
        const data = await UserManager.findOne({_id:job.data.QueueData.currentuserid}).select('name')
        if(data){
            // const ReciverStatus = await RedisManager.hget('onlineUsers',job.data.QueueData._id)
            const ReciverStatus = await RedisManager.zrange(`onlineUsers${job.data.QueueData._id}`, 0, -1);
            // console.log(ReciverStatus)
            if(ReciverStatus.length==0){
                console.log('This Worked ')
                const Notification = data.name + " Has Followed You"
                const DatabaseNotification = {
                  Notification:Notification,
                  timestamp:Date.now()
                }
                  const AddingNotification = await UserManager.updateOne({
                    _id:job.data.QueueData._id
                  },
                  {
                    $push:{
                        'Notifications.ActiveNotifications':DatabaseNotification,
                    }
                  }
                )
                
            }else{
                console.log('Else Worked')
                
                const Notification = data.name + " Has Followed You"
                const DatabaseNotification = {
                  Notification:Notification,
                  timestamp:Date.now()
                }
            const AddingNotification = await UserManager.updateOne({
                _id:job.data.QueueData._id
              },
              {
                $push:{
                    'Notifications.ActiveNotifications':DatabaseNotification,
                }
              }
            
            )
            const RecId=job.data.QueueData._id
            await RedisPublisher.publish('FollowNotification',JSON.stringify({RecId,DatabaseNotification}))
            }
        }
      
    },
   { connection:RedisManager})


}

module.exports = ForFollowWorker;