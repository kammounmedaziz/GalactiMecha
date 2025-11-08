import { encrypt, decrypt } from '../services/encryptionService.js';

export const encryptionMiddleware = (req, res, next) => {
  if (req.body && req.body.message) {
    try {
      const encryptedMessage = encrypt(req.body.message);
      req.body.message = encryptedMessage;
    } catch (error) {
      return res.status(500).json({ error: 'Encryption failed', message: error.message });
    }
  }
  next();
};

export const decryptionMiddleware = (req, res, next) => {
  if (req.body && req.body.encryptedMessage) {
    try {
      const decryptedMessage = decrypt(req.body.encryptedMessage);
      req.body.message = decryptedMessage;
    } catch (error) {
      return res.status(500).json({ error: 'Decryption failed', message: error.message });
    }
  }
  next();
};