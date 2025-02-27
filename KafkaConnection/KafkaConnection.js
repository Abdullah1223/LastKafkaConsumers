const { Kafka, logLevel } = require('kafkajs');
const fs = require('fs');

// Ensure that the CA certificate path is correct
const caCert = fs.readFileSync('./KafkaConnection/ca.pem', 'utf-8');

const kafka = new Kafka({
  clientId: 'MusicAppNew',
  brokers: ['kafka-3ec5bc2c-testtust21-e578.g.aivencloud.com:11872'],
  ssl: {
    ca: [caCert], 
  },
  sasl: {
    mechanism: 'SCRAM-SHA-512', // Check if Aiven requires SCRAM-SHA-512 instead
    username: 'avnadmin',
    password: "AVNS_9U_F_D6RfJyeUKHzReC", // Your Aiven credentials
  },
  logLevel: logLevel.ERROR,
});

// const producer = kafka.producer();
const competitionconsumer = kafka.consumer({groupId:'Competition_Consumer'})
 const consumer = kafka.consumer({ groupId: 'kafka_music' });
 const messageconsumer = kafka.consumer({groupId:'Message_consumer'})
 const messagedeliveredconsumer = kafka.consumer({groupId:'Message_Delivered'})
 const profileUpdateConsumer = kafka.consumer({groupId:'profile_Update_Consumer'})
 const messagemodificationconsumer = kafka.consumer({groupId:'message_modification_consumer'})
 const competitioncategoryconsumer = kafka.consumer({groupId:'competition_category_consumer'})
 const emailconsumer = kafka.consumer({groupId:'email_consumer'})
// Connect the producer to Kafka
const connection = async () => {
  try {
    await consumer.connect()
    await messageconsumer.connect()
    await competitionconsumer.connect()
    await messagedeliveredconsumer.connect()
    await profileUpdateConsumer.connect()
    await messagemodificationconsumer.connect()
    await competitioncategoryconsumer.connect()
    await emailconsumer.connect()
     console.log('Competition ConsumerConnected')
    
  } catch (error) {
    console.error('Error connecting producer:', error);
  }
};

module.exports = { connection, kafka,emailconsumer, competitionconsumer,consumer,messagedeliveredconsumer, profileUpdateConsumer,messagemodificationconsumer , competitioncategoryconsumer};
