import crypto from 'crypto';

// Generate a random key for encryption
export function generateKey(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Encrypt a message using a given key
export function encryptMessage(message, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt a message using a given key
export function decryptMessage(encryptedMessage, key) {
  const parts = encryptedMessage.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = Buffer.from(parts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Hash a message using SHA-256
export function hashMessage(message) {
  return crypto.createHash('sha256').update(message).digest('hex');
}