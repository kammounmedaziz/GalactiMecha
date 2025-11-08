import { encrypt, decrypt } from '../services/encryptionService.js';

class EncryptionController {
  async encryptMessage(req, res) {
    try {
      const { message } = req.body;
      const encryptedMessage = await encrypt(message);
      res.json({
        success: true,
        encryptedMessage
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Encryption failed',
        error: error.message
      });
    }
  }

  async decryptMessage(req, res) {
    try {
      const { encryptedMessage } = req.body;
      const decryptedMessage = await decrypt(encryptedMessage);
      res.json({
        success: true,
        decryptedMessage
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Decryption failed',
        error: error.message
      });
    }
  }
}

export default new EncryptionController();