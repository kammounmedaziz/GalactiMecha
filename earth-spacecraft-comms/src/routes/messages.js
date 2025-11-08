import express from 'express';
import MessageController from '../controllers/messageController.js';

const router = express.Router();
const messageController = new MessageController();

// Route to send a message
router.post('/send', messageController.sendMessage.bind(messageController));

// Route to receive messages
router.get('/receive', messageController.receiveMessage.bind(messageController));

export default router;