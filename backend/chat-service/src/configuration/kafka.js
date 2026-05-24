import { Kafka } from 'kafkajs';
import { kafkaServer, enableKafka } from './dotenv.js';
import { listenersliveStatus } from '../service/conversationService.js';

const kafka = new Kafka({
  clientId: 'social-app',
  brokers: [kafkaServer], 
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'social-status-group' });

export const connectProducer = async () => {
  if (!enableKafka) {
    console.warn('Kafka disabled by ENABLE_KAFKA=false');
    return;
  }
  await producer.connect();
  console.log("Kafka Producer connected");
};

export const sendNotificationEvent = async (data) => {
  if (!enableKafka) return;
  try {
    await producer.send({
      topic: "social.notifications",
      messages: [
        {
          value: JSON.stringify(data)
        }
      ]
    });
  } catch (error) {
    console.error("Failed to publish notification event:", error.message);
  }
};

export const connectConsumer = async () => {
  if (!enableKafka) return;
  await consumer.connect();
  // Subscribe 2 topic
  await consumer.subscribe({ topic: 'social.user.online', fromBeginning: false });
  await consumer.subscribe({ topic: 'social.user.offline', fromBeginning: false });

  // Lắng nghe message
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const value = message.value?.toString();
      let data = null;

      try {
        data = JSON.parse(value);
      } catch (e) {
        console.error("Invalid JSON:", value);
      }

      if (topic === "social.user.online") {
        console.log("User ONLINE:", data);
        await listenersliveStatus(data);
      } 
      
      if (topic === "social.user.offline") {
        console.log("User OFFLINE:", data);
        await listenersliveStatus(data);
      }
    },
  });
};
