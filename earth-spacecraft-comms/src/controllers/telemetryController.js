import Telemetry from '../models/Telemetry.js';

class TelemetryController {
  async sendTelemetry(req, res) {
    try {
      const telemetryData = req.body;

      // Validate telemetry data
      // Assuming a validate function exists in utils/validator.js
      const isValid = validateTelemetryData(telemetryData);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid telemetry data' });
      }

      // Save telemetry data to the database
      const telemetry = new Telemetry(telemetryData);
      await telemetry.save();

      res.status(201).json({ success: true, message: 'Telemetry data sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send telemetry data', message: error.message });
    }
  }

  async getTelemetry(req, res) {
    try {
      const telemetryData = await Telemetry.find(); // Fetch all telemetry data

      res.json({ success: true, telemetryData });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve telemetry data', message: error.message });
    }
  }
}

export default TelemetryController;