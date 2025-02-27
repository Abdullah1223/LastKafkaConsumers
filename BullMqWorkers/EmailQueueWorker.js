const { Worker } = require("bullmq")
const RedisManager = require("../RedisConnection/RedisConnection");
const { Resend } = require("resend");
const nodemailer = require('nodemailer');

const EmailQueueWorker = async()=>{
  
    transporter = nodemailer.createTransport({
        service:'gmail',
        port:465,
        secure:true,
        auth:{
            user:'testtust21@gmail.com',
            pass:'gluw kcao qhuh vkgg'
        }
       })

    const resend = new Resend("re_5DzsmGqZ_2eaFBp44U2qg3qZSSDgTpESX");

    const worker = new  Worker('emailqueue',async(job)=>{
        const {ValidationCode,email,type}=job.data.data
       // console.log(ValidationCode)
      try{
        const info = await transporter.sendMail({
            from: 'testtust21@gmail.com', // sender address
            to: `${email}`, // list of receivers
            subject: "Verification Code ForSignup", // Subject line
            text: 'Thnkas ForSigning Up This is YourCode ' + ValidationCode, // plain text body
          });       
      } catch(err){
        console.log(err)
      }
          
    },
    {connection:RedisManager}
)



}

module.exports = EmailQueueWorker