module.exports = {
  port: process.env.PORT || 3000,
  encryptionKey: process.env.ENCRYPTION_KEY || 'defaultEncryptionKey',
  messageQueueLimit: process.env.MESSAGE_QUEUE_LIMIT || 100,
  telemetryEndpoint: process.env.TELEMETRY_ENDPOINT || 'http://localhost:3000/telemetry',
  messageEndpoint: process.env.MESSAGE_ENDPOINT || 'http://localhost:3000/messages',
  signalDelay: process.env.SIGNAL_DELAY || 2 // seconds
};