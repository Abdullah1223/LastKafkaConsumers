const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
     
     name:{type:String,required:true},
     avatar:{type:String},
     email:{type:String,required:true,unique:true },
     username:{type:String,required:true,unique:true},
     password:{type:String,required:true},
     role:{type:String,required:true},
     bio:{type:String,required:true},
     isValidated:{type:Boolean,required:true},
     competitions: [{

     }],  // For artist role
    following: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },  // Reference to the UserManager collection (Users)
        followingsince: { type: Date }
      }],
    followers:[
      {user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },  // Reference to the UserManager collection (Users)
      followingsince: { type: Date }}],
    saved:[{
      _id:{ type: mongoose.Schema.Types.ObjectId, ref: 'competition' }
     }],
    transactionhistory:[{}], 
    rating:[{
     uid:{type:String},
     ratingval:{type:Number}
}] ,
    judgingpanel:[{
     uid:{type:String}
    }],
    recentactivity:[],
    tracks:[],
    Notifications:{
      ActiveNotifications:[
        {
          Notification:{type:String},
          timestamp:{type:Date},
          NotificationType:{type:String}
        }
      ],
      EmailNotifications:[],
      CompetitionNotifications:[],

    }
     
})

const UserManager = mongoose.model('users',UserSchema)

module.exports = UserManager;