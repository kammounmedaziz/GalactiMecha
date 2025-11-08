import express from 'express';
import EncryptionController from '../controllers/encryptionController.js';

const router = express.Router();
const encryptionController = new EncryptionController();

// Route to encrypt a message
router.post('/encrypt', encryptionController.encryptMessage);

// Route to decrypt a message
router.post('/decrypt', encryptionController.decryptMessage);

export default router;