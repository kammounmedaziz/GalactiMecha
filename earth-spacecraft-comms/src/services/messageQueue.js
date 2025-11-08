import { Queue } from 'bull';

const messageQueue = new Queue('messageQueue');

// Add a message to the queue
export const addMessageToQueue = async (message) => {
  await messageQueue.add(message);
};

// Process messages from the queue
messageQueue.process(async (job) => {
  // Here you would handle the message processing logic
  console.log('Processing message:', job.data);
});

// Get the current queue length
export const getQueueLength = async () => {
  const count = await messageQueue.count();
  return count;
};

// Clear the queue
export const clearQueue = async () => {
  await messageQueue.empty();
};