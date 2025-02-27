const EmailQueue = require("../BullMqQueues/EmailQueue")
const { emailconsumer } = require("../KafkaConnection/KafkaConnection")

const EmailConsumer = async()=>{


    await emailconsumer.subscribe({topic:'MusicAppNew',fromBeginning:false,groupId:'email_consumer'})
 
    await emailconsumer.run({eachMessage:async({topic,partition,message})=>{
                
        if(partition==7){
        const parsedData = JSON.parse(message.value.toString())
        if(parsedData.type=="Email_Verification")
        await EmailQueue.add('Email_Verification',{data:parsedData},{priority:1})
        }
    }})

}

module.exports = EmailConsumer