const { default: mongoose } = require("mongoose");

const MessageSchema = mongoose.Schema({
    sender_id:{type:mongoose.Schema.Types.ObjectId,ref:'users'}, 
   reciver_id:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
   // chat_id:{type:mongoose.Schema.Types.ObjectId,ref:'chats'},
   chat_id :{type:String},
    message:{type:String},
    timestamp:{type:Date},
    isRead:{type:Boolean},
    Status:{type:String},
    isDelete:{type:Boolean},
    isEdit:{type:Boolean},
    DeleteFor:[{type:mongoose.Schema.Types.ObjectId,default:[]}]
})

MessageSchema.index({chat_id: -1});
MessageSchema.index({timestamp: -1});

const MessageManager = mongoose.model('Messages',MessageSchema)
module.exports = MessageManager;