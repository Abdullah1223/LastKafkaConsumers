const mongoose = require('mongoose')

const conn = async(uri)=>{
    await mongoose.connect(uri).then(()=>{console.log('MongoDb is Connected')})
} 
module.exports = conn;