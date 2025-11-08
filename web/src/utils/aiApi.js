import { Client } from "@gradio/client";

const GRADIO_BASE = 'http://127.0.0.1:7860';

class AIApiClient {
  constructor() {
    this.gradioClient = null;
  }

  async init() {
    if (!this.gradioClient) {
      this.gradioClient = await Client.connect(GRADIO_BASE);
    }
    return this.gradioClient;
  }

  /**
   * Single-step navigation simulation
   * @param {string} instruction - Mission instruction
   * @param {boolean} useAnomaly - Whether to inject anomaly
   */
  async simulateNavigation(instruction, useAnomaly = false) {
    try {
      const client = await this.init();
      const result = await client.predict("/simulate_navigation", {
        instruction,
        use_anomaly: useAnomaly
      });
      
      return {
        success: true,
        prediction: result.data[0]
      };
    } catch (error) {
      console.error('Navigation simulation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Multi-step simulation with anomaly detection
   * @param {string} instruction - Mission instructions
   * @param {number} steps - Number of simulation steps
   * @param {number} anomalyRate - Anomaly injection rate (0-1)
   * @param {number} sensitivity - Detection sensitivity (0-1)
   */
  async runSimulation(instruction, steps = 50, anomalyRate = 0.1, sensitivity = 0.5) {
    try {
      console.log('Running simulation with:', { instruction, steps, anomalyRate, sensitivity });
      
      const client = await this.init();
      const result = await client.predict("/run_simulation", {
        instruction,
        steps,
        anomaly_rate: anomalyRate,
        sensitivity
      });
      
      console.log('Gradio client result:', result);
      
      const [summary, sensorPlot, trajectoryPlot, detailsTable] = result.data;
      
      console.log('Parsed components:', {
        summary: summary?.substring(0, 100),
        sensorPlot: typeof sensorPlot,
        trajectoryPlot: typeof trajectoryPlot,
        detailsTable: typeof detailsTable
      });
      
      return {
        success: true,
        summary,
        sensorPlot,
        trajectoryPlot,
        detailsTable
      };
    } catch (error) {
      console.error('Simulation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Run analytics test comparing navigation approaches
   * @param {string} instruction - Test instructions
   * @param {number} steps - Test duration
   */
  async runAnalyticsTest(instruction, steps = 50) {
    try {
      console.log('Running analytics with:', { instruction, steps });
      
      const client = await this.init();
      const result = await client.predict("/run_analytics_test", {
        instruction,
        steps
      });
      
      console.log('Analytics response:', result);
      
      return {
        success: true,
        results: result.data[0]
      };
    } catch (error) {
      console.error('Analytics test error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Run attack scenario with baseline vs attacked comparison
   * @param {string} instruction - Mission instructions
   * @param {number} totalSteps - Mission duration
   * @param {number} attackStart - When attack starts
   * @param {number} attackDuration - How long attack lasts
   */
  async runAttackScenario(instruction, totalSteps = 50, attackStart = 15, attackDuration = 10) {
    try {
      console.log('Running attack scenario with:', { instruction, totalSteps, attackStart, attackDuration });
      
      const client = await this.init();
      const result = await client.predict("/run_attack_scenario", {
        instruction,
        total_steps: totalSteps,
        attack_start: attackStart,
        attack_duration: attackDuration
      });
      
      console.log('Attack scenario response:', result);
      
      // Gradio returns: [summary, trajectory_fig, timeline_fig, impact_fig]
      const [summary, trajectoryPlot, timelinePlot, impactPlot] = result.data;
      
      console.log('Attack plots received:', {
        summary: summary ? 'present' : 'missing',
        trajectoryPlot: trajectoryPlot ? 'present' : 'missing', 
        timelinePlot: timelinePlot ? 'present' : 'missing',
        impactPlot: impactPlot ? 'present' : 'missing'
      });
      
      return {
        success: true,
        summary,
        trajectoryPlot,      // Trajectory comparison (Normal vs Attacked)
        detectionPlot: timelinePlot,  // Attack detection timeline
        deviationPlot: impactPlot     // Sensor data deviations
      };
    } catch (error) {
      console.error('Attack scenario error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async checkHealth() {
    try {
      await this.init();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Parse Plotly JSON from response
   * Handles both Plotly figures and Matplotlib figures from Gradio
   */
  parsePlotlyData(plotData) {
    if (!plotData) {
      console.warn('No plot data provided');
      return null;
    }
    
    try {
      console.log('Parsing plot data type:', typeof plotData);
      
      // Check if it's a base64 image string (matplotlib plot)
      if (typeof plotData === 'string' && plotData.startsWith('data:image')) {
        console.log('Detected base64 image (matplotlib plot)');
        return { type: 'image', data: plotData };
      }
      
      // If it's already an object with data property (Plotly format)
      if (typeof plotData === 'object' && plotData.data) {
        console.log('Plot data already has data property (Plotly format)');
        return plotData;
      }
      
      // If it has a plot property, parse that
      if (plotData.plot) {
        console.log('Parsing plot property');
        return JSON.parse(plotData.plot);
      }
      
      // If it's a JSON string (not base64), try to parse it
      if (typeof plotData === 'string' && !plotData.startsWith('data:')) {
        console.log('Parsing JSON string plot data');
        const parsed = JSON.parse(plotData);
        return parsed;
      }
      
      // If it's an object but not Plotly format, might be a file reference
      if (typeof plotData === 'object') {
        console.log('Plot data is object, checking for file/url');
        // Check if it has a url or path property (image-based plot)
        if (plotData.url || plotData.path || plotData.name) {
          console.log('Plot appears to be an image reference:', plotData);
          return { type: 'image', data: plotData.url || plotData.path };
        }
      }
      
      console.log('Returning plot data as-is');
      return plotData;
    } catch (error) {
      console.error('Error parsing plot data:', error);
      console.log('Failed plot data type:', typeof plotData);
      return null;
    }
  }
}

export default new AIApiClient();
