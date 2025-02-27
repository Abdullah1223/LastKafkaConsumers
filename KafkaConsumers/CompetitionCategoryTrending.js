const { competitioncategoryconsumer } = require("../KafkaConnection/KafkaConnection");
const CategoryManager = require("../models/CategorySchema");


const CompetitionCategoryTrending = async()=>{
             //idhr group id ki jga groud id hai
    competitioncategoryconsumer.subscribe({topic:'MusicAppNew',fromBeginning:true,groudId:'competition_category_consumer'})

    await competitioncategoryconsumer.run({
        eachBatch: async ({ batch }) => {
            const BulkOps = [];

          try{
            for (let msg of batch.messages) {
                const parsedData = JSON.parse(msg.value.toString());
                console.log(parsedData);

                // Ensure the message has a valid category
             

                // Determine which field to increment based on the message type
                let updateField = {};
                if (parsedData.type === "Saved") {
                    updateField = { $inc: { totalSaves: 1 } };
                } else if (parsedData.type === "Views") {
                    updateField = { $inc: { totalViews: 1 } };
                } else if (parsedData.type === "Joined") {
                    updateField = { $inc: { totalParticipants: 1 } };
                } else if(parsedData.type=="SavedRemoved"){
                    updateField = { $inc: { totalSaves: -1 } };
                }
                 else {
                    continue; // Skip unknown types
                }

                // Push the update operation to BulkOps
                BulkOps.push({
                    updateOne: {
                        filter: { Category_name: parsedData.competition_category },
                        update: updateField,
                        upsert: true, // Create the category if it doesn't exist
                    },
                });
            }

            
            if (BulkOps.length > 0) {
                console.log('If Block Worked')
                await CategoryManager.bulkWrite(BulkOps);
                console.log(`Bulk updated ${BulkOps.length} categories`);
            }
          }catch(err){
            console.log(err)
          }
        },
    });
} 



module.exports = CompetitionCategoryTrending;