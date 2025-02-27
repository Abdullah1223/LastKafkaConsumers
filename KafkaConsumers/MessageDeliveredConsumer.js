const { messagedeliveredconsumer } = require("../KafkaConnection/KafkaConnection")
const MessageManager= require('../models/MessageSchema')
const { RedisPublisher } = require("../RedisConnection/ForPubSub")
const MessageDeliveredConsumer = async ()=>{

  messagedeliveredconsumer.subscribe({topic:'MusicAppNew',fromBeginning:true})

  messagedeliveredconsumer.run({eachMessage:async({topic,partition,message})=>{

     
     if(partition===3){
    const data = JSON.parse(message.value.toString())
      
      const DatabaseUpdate= await MessageManager.updateMany({_id:data.message_id},{
        $set:{
            'Status':data.Status
        }
      })

       if(DatabaseUpdate){
        if(data.Status=="Seen"){
          const Publishing = await RedisPublisher.publish('MessageSeen',JSON.stringify(data))

        }else{
          const Publishing = await RedisPublisher.publish('MessageDelivered',JSON.stringify(data))
        }
       }


     }

  }})

}

module.exports  = MessageDeliveredConsumer