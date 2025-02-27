const { default: mongoose } = require("mongoose");

const CategorySchema  = mongoose.Schema({

         Category_name:{type:"String"},
         totalSaves:{type:Number},
         totalViews:{type:Number},
         totalParticipants:{type:Number},     
})


CategorySchema.index({Category_name:1})

const CategoryManager = mongoose.model('category',CategorySchema)

module.exports = CategoryManager;