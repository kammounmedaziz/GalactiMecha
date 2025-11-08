import Message from '../models/Message';

class MessageController {
  async sendMessage(req, res) {
    try {
      const { content, recipient } = req.body;

      // Validate input
      if (!content || !recipient) {
        return res.status(400).json({ error: 'Content and recipient are required' });
      }

      const message = new Message({ content, recipient, timestamp: new Date() });
      await message.save();

      res.status(201).json({ success: true, message: 'Message sent successfully', data: message });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message', message: error.message });
    }
  }

  async receiveMessage(req, res) {
    try {
      const { recipient } = req.params;

      const messages = await Message.find({ recipient }).sort({ timestamp: -1 });

      res.json({ success: true, messages });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve messages', message: error.message });
    }
  }
}

export default new MessageController();