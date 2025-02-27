const mongoose= require('mongoose')

const CompetitionSchema =  mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    image:{type:String,required:true},
    createdby:{type:String,required:true},
    participants:[{
        id:{type:mongoose.Schema.Types.ObjectId},
        track:{type:String},
        albumart:{type:String},
        sportifyurl:{type:String},
        applemusic:{type:String},
        soundcloud:{type:String},
        description:{type:String},
    }],
    createdate:{type:Date,required:true},
    startdate:{type:Date,required:true},
    deadline:{type:Date,required:true},
    prize:{type:Number,required:true},
    ifentryfees:{type:Boolean,required:true},
    entryFee:{type:Number},
    genre:{type:String,required:true},
    status:{type:String,required:true},
    winner:{type:mongoose.Schema.Types.ObjectId},
    statusforartist:{type:String},
    losers:[{
        _id:{type:mongoose.Schema.Types.ObjectId}
    }],

})
CompetitionSchema.index({createdate:-1})

const CompetitionManager = mongoose.model('competition',CompetitionSchema);

module.exports = CompetitionManager;
