const amqplib=require("amqplib");
const {MESSAGE_BROKER_URL, EXCHANGE_NAME }=require("../config/serverConfig");

const createChannel=async()=>{
    try {
        // Setting up a connection using nodeJS based client for RabbitMQ
        const connection=await amqplib.connect(MESSAGE_BROKER_URL);
        const channel=await connection.createChannel();
// assertExchange function setup Exchange Destributor for sending the
//  messages  to queues based on their binding key.
        await channel.assertExchange(EXCHANGE_NAME,"direct",false);
        return channel;
    } catch (error) {
     throw error;   
    }
}
// Every queue has a unique binding key used to recognize this queue

const  subscribeMessage=async (channel,service,binding_key)=>{
    try {
        const applicationQueue=await channel.assertQueue("QUEUE_NAME");
        // assertQueue function will return the queue if it is present 
        // or create a queue and return it.
        channel.bindQueue(applicationQueue.queue,EXCHANGE_NAME,binding_key);
    
        channel.consume(applicationQueue.queue,msg=>{
            console.log("received data");
            console.log(msg.content.toString());
            // We are acknowledging that we have received the message
            channel.ack(msg);
        });

        } catch (error) {
            throw error;
        }
 }

const publishMessage=async(channel,binding_key,message)=>{
    try {
        await channel.assertQueue("QUEUE_NAME");
        await channel.publish(EXCHANGE_NAME,binding_key,Buffer.from(message));
        // We are not sending the message object directly we are sending it as covered on a buffer object
    } catch (error) {
        throw error;
    }
}

module.exports={
    subscribeMessage,
    createChannel,
    publishMessage
}