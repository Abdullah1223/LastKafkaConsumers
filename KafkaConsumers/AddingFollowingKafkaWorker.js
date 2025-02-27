const NotificationForFollow = require("../BullMqQueues/NotificationForFollow");
const { consumer } = require("../KafkaConnection/KafkaConnection");
const UserManager = require('../models/UserSchema');
const  RedisManager  = require("../RedisConnection/RedisConnection");
// const { getIo } = require("../Socketio");
const AddingFollowingKafkaWorker = async()=>{
   // const Io = getIo()
    console.log('Following Worker Connected')
    await consumer.subscribe({topic:'MusicAppNew',fromBeginning:true})
  
    await consumer.run({eachMessage:async({topic,partition,message})=>{
       const parsedData = JSON.parse(message.value.toString())
       console.log(parsedData)
        if(partition===1){
            try{
               let bulkOpsFollow=[];
               let bulkOpsUnfollow=[];
                if(parsedData.action=='Follow'){
                    bulkOpsFollow.push({
                      updateOne: {
                        filter: { _id: parsedData.currentuserid },
                        update: { $push: { following: { user: parsedData._id, followSince: new Date() } } },
                      },
                    });
                    bulkOpsFollow.push({
                      updateOne: {
                        filter: { _id: parsedData._id },
                        update: { $push: { followers: { user: parsedData.currentuserid, followSince: new Date() } } },
                      },
                    })
                  }else if(parsedData.action=="Unfollow"){
                      bulkOpsUnfollow.push({
                          updateOne: {
                            filter: { _id: parsedData.currentuserid },
                            update: { $pull: { following: { user: parsedData._id } } },
                          },
                        });
                        bulkOpsUnfollow.push({
                          updateOne: {
                            filter: { _id: parsedData._id },
                            update: { $pull: { followers: { user: parsedData.currentuserid } } },
                          },
                        });
                  }
                  const SenderSocketId = await RedisManager.hget('onlineUsers',parsedData.currentuserid)
                  if(bulkOpsFollow.length>0){
                      const writing = await UserManager.bulkWrite(bulkOpsFollow)
                      if(writing){
                        const DeletingCache = await RedisManager.del(`${parsedData.currentuserid}following`)
                        const DeletingSecondCache = await RedisManager.del(`${parsedData.currentuserid}:followinglist`)
                       const QueueData = {
                        currentuserid : parsedData.currentuserid,
                        _id :parsedData._id
                       }
                       await NotificationForFollow.add('notificationforfollow',{QueueData})
                      
                      }else{
                      }
                      bulkOpsFollow=[];
                  }else if (bulkOpsUnfollow.length>0){
                    const DeletingCache = await RedisManager.del(`${parsedData.currentuserid}following`)   
                    const DeletingSecondCache = await RedisManager.del(`${parsedData.currentuserid}:followinglist`)
                    const removing = await UserManager.bulkWrite(bulkOpsUnfollow)
                    if(removing){
                    }
                 bulkOpsUnfollow=[]
                  }
            }catch(err){
                console.log(err)
            } 


        }
    }})

}

module.exports =AddingFollowingKafkaWorker;