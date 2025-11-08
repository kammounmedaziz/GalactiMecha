import express from 'express';
import TelemetryController from '../controllers/telemetryController.js';

const router = express.Router();
const telemetryController = new TelemetryController();

// Route to send telemetry data from the spacecraft to Earth
router.post('/send', telemetryController.sendTelemetry);

// Route to retrieve telemetry data
router.get('/data', telemetryController.getTelemetry);

export default router;