const { messagemodificationconsumer } = require("../KafkaConnection/KafkaConnection");
const MessageManager = require("../models/MessageSchema");
const ChatManager = require('../models/ChatSchema')
const MessageModificationConsumer = async ()=>{
  
    await messagemodificationconsumer.subscribe({topic:'MusicAppNew',fromBeginning:true,groudId:'message_modification_consumer'})
  
    await messagemodificationconsumer.run({eachMessage:async({topic,partition,message})=>{

             if(partition==5){
                const parsedData = JSON.parse(message.value.toString())
                console.log('Kafka Consumed Here')
                if(parsedData.type=='DeleteForEveryone'){
                   //deleteforeveryone
                  const UpdatingChat = await ChatManager.findOneAndUpdate({chat_id:parsedData.chat_id , message_uid:parsedData.uid},{
                    $set:{
                       lastMessage:{
                        message:parsedData.message,
                        timestamp:Date.now()
                       },

                    }
                    

                  })

                  const Edit = await MessageManager.findOneAndUpdate({_id:parsedData.message_id},{
                    $set:{
                        isDelete:true,
                        message:parsedData.message,
                        Status:'Deleted'
                    }
                })
                }else if(parsedData.type=='DeleteForYou'){
                    //delete
                    console.log('Delete For You Block Worked')
                    console.log(parsedData.currentuserid)
                    try{
                        const Delete = await MessageManager.findOneAndUpdate({_id:parsedData.message_id},{
                            $push:{
                                DeleteFor:parsedData.currentuserid
                            }
                        })
                        console.log('Database Operation Worked')
                    }catch(err){
                        console.log(err)
                    }
                }else{
                    ///edit
                    console.log('This IS Edit BLOCK!')
                   try{
                    const UpdatingChat = await ChatManager.findOneAndUpdate({chat_id:parsedData.chat_id , message_uid:parsedData.uid},{
                        $set:{
                           lastMessage:{
                            message:parsedData.MessageForEdit,
                            timestamp:Date.now()
                           },
    
                        }
                        
    
                      })
                      console.log(parsedData.chat_id)
                      console.log('Chat Updated')
                      console.log(parsedData.message_id)
                    const Edit = await MessageManager.findOneAndUpdate({_id:parsedData.message_id},{
                        $set:{
                            isEdit:true,
                            message:parsedData.MessageForEdit,
                        }
                    })
                    console.log('Message Updated')
                   }catch(err){
                    console.log(err)
                   }
                }
             }
    }
    
      

})

}

module.exports = MessageModificationConsumer;