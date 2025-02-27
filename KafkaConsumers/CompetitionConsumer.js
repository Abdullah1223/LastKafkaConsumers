const {competitionconsumer}=require('../KafkaConnection/KafkaConnection')
const RedisManager = require('../RedisConnection/RedisConnection')
const CompetitionManager = require('../models/CompetitionSchema')
const {RedisPublisher} = require('../RedisConnection/ForPubSub')
const CompetitionConsumer = async()=>{
     
    await competitionconsumer.subscribe({topic:'MusicAppNew',fromBeginning:true,groudId:'Competition_Consumer'})

   await competitionconsumer.run({eachMessage:async({topic,partition,message})=>{
    
        if(partition===2){
            const parsedData = JSON.parse(message.value.toString())
            const createdate = new Date();
            try{
             // const category = job.data.category.toLowercase()
             const CreatingCompetition = await CompetitionManager.create({
                 title:parsedData.name,
                 
                 description:parsedData.description,
                 image:parsedData.image,
                 createdby:parsedData._id,
                 createdate:createdate,
                 startdate:parsedData.startdate,
                 deadline:parsedData.lastdate,
                 prize:parsedData.prizemoney,
                 ifentryfees:parsedData.ifentryfees,
                 entryFee:parsedData.entryfees,
                 genre:parsedData.category,
                 status:'upcoming'
             })
             console.log(CreatingCompetition)
          if(CreatingCompetition){
            const data = {
              CreatorId:parsedData._id,
              CompetitionName:parsedData.name,
              StartDate:parsedData.startdate,
              Deadline:parsedData.lastdate,
            }
            await RedisPublisher.publish('Creation',JSON.stringify(data))
        await RedisManager.del('AllCompetitionData')
     
          }
            }catch(err){
              console.log(err)
          
            }
          
        }
    }})
 
}

module.exports = CompetitionConsumer