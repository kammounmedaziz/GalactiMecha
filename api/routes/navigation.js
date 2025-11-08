/**
 * Navigation Routes
 * Single-step navigation prediction and guidance
 */

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';

const router = express.Router();

// Single navigation prediction
router.post('/predict', async (req, res) => {
  try {
    const { instruction, injectAnomaly = false } = req.body;

    if (!instruction) {
      return res.status(400).json({
        error: 'Missing required parameter: instruction'
      });
    }

    // Call Python AI backend
    const pythonScript = path.join(process.cwd(), '..', 'ai', 'scripts', 'predict.py');
    const pythonProcess = spawn('python', [
      pythonScript,
      '--instruction', instruction,
      '--anomaly', injectAnomaly ? 'true' : 'false'
    ]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          error: 'AI prediction failed',
          details: error
        });
      }

      try {
        const parsedResult = JSON.parse(result);
        res.json({
          success: true,
          instruction,
          anomalyInjected: injectAnomaly,
          prediction: parsedResult,
          timestamp: new Date().toISOString()
        });
      } catch (parseError) {
        res.status(500).json({
          error: 'Failed to parse AI response',
          details: result
        });
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

// Get guidance vector from instruction
router.post('/guidance', async (req, res) => {
  try {
    const { instruction } = req.body;

    if (!instruction) {
      return res.status(400).json({
        error: 'Missing required parameter: instruction'
      });
    }

    // Simulate guidance vector generation (in real app, call Python AI)
    const guidanceVector = [
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ];

    res.json({
      success: true,
      instruction,
      guidanceVector,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
});

export default router;
