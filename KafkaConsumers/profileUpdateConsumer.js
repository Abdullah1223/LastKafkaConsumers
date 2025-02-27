const { profileUpdateConsumer } = require("../KafkaConnection/KafkaConnection")
const UserManager = require("../models/UserSchema")
const { RedisPublisher } = require("../RedisConnection/ForPubSub")
const RedisManager = require("../RedisConnection/RedisConnection")

const profileUpdateConsumerMainFunc = async()=>{



    await profileUpdateConsumer.subscribe({topic:'MusicAppNew',fromBeginning:true,groudId:'profile_Update_Consumer'})

    await profileUpdateConsumer.run({eachMessage:async({topic,partition,message})=>{


        if(partition==4){
            const parsedData = JSON.parse(message.value.toString())
            try{
        const DataForSending={
            _id:parsedData._id,
            Type:''
        }
        
        if(parsedData.type=='profilePasswordUpdate'){
            const UpdatingDatabase = await UserManager.findOneAndUpdate({_id:parsedData._id},{
                $set:{
                password:parsedData.password
                }
               })
               if(UpdatingDatabase){
                const Send = {...DataForSending,Type:'PasswordUpdate'}
                await RedisPublisher.publish('ProfileModification',JSON.stringify(Send))
               }    
        }else{
       const UpdatingDatabase = await UserManager.findOneAndUpdate({_id:parsedData._id},{
        $set:{
            name:parsedData.name,
            username:parsedData.username,
            bio:parsedData.bio,
        }
       }) 
       if(UpdatingDatabase){
        const Deleting = await RedisManager.del(`${parsedData._id}Profile`)
        const Send = {...DataForSending,Type:'ProfileUpdate'}
        await RedisPublisher.publish('ProfileModification',JSON.stringify(Send))
       }    
    
    }
      }catch(err){
        const DataForSending={
            _id:parsedData._id,
            Type:'Error'
        }
        await RedisPublisher.publish('ProfileModification',JSON.stringify(DataForSending))
         
      }

    }
    }



})
}

module.exports = profileUpdateConsumerMainFunc;