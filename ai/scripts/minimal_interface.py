"""Minimal GalactiMecha interface for testing."""

import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import gradio as gr
import numpy as np

# Try to import dependencies, fallback to dummy if not available
try:
    from data.data_generator import generate_correct_data, inject_fake_data
    from modules.slm_module import slm
    from models.navigation import predict_next_move
    from modules.anomaly_detector import AnomalyDetector
    from utils.drift import detect_drift

    detector = AnomalyDetector()
    clean_data = generate_correct_data(100)
    detector.fit(clean_data.drop(['timestamp', 'landing_zone_lat', 'landing_zone_lon'], axis=1).values)

    dependencies_available = True
except Exception as e:
    print(f"Warning: Dependencies not available: {e}")
    dependencies_available = False

    class DummySLM:
        def interpret_instruction(self, instruction):
            return np.array([0.1, 0.2, 0.3])

    class DummyDetector:
        def decision_function(self, data):
            return np.array([[0.0]])
        def detect(self, data):
            return 1

    class DummyPredictor:
        def __call__(self, state, guidance):
            return np.random.normal(0, 0.5, 6)

    slm = DummySLM()
    detector = DummyDetector()
    predict_next_move = DummyPredictor()
    detect_drift = lambda *args: {"drift_detected": False, "score": 0.0}

def run_quick_simulation(instruction, steps=20):
    """Run a quick simulation."""
    if not dependencies_available:
        return f"Demo Mode: Would simulate '{instruction}' for {steps} steps"

    try:
        guidance = slm.interpret_instruction(instruction)

        results = {
            'steps': [], 'anomalies': [], 'fuel_levels': [], 'distances': []
        }

        current_fuel = 100.0
        current_pos = np.array([50000.0, 0.0, 0.0])

        for step in range(steps):
            data = generate_correct_data(1)
            state = data.drop(['timestamp', 'landing_zone_lat', 'landing_zone_lon'], axis=1).values[0]

            anomaly_score = detector.decision_function([state])[0]
            is_anomaly = anomaly_score < -0.5

            move = predict_next_move(state, guidance)
            thrust_magnitude = np.linalg.norm(move[:3])
            current_fuel = max(0, current_fuel - thrust_magnitude * 0.1)

            velocity = state[3:6]
            current_pos += velocity * 0.1 + move[:3] * 0.01
            distance_to_mars = np.linalg.norm(current_pos)

            results['steps'].append(step)
            results['anomalies'].append(is_anomaly)
            results['fuel_levels'].append(current_fuel)
            results['distances'].append(distance_to_mars)

        anomaly_count = sum(results['anomalies'])
        final_fuel = results['fuel_levels'][-1]
        final_distance = results['distances'][-1]

        return f"""
🚀 **GalactiMecha Simulation Results**

**Mission:** {instruction}
**Duration:** {steps} steps
**Guidance Vector:** [{guidance[0]:.2f}, {guidance[1]:.2f}, {guidance[2]:.2f}]

**Results:**
- Anomalies Detected: {anomaly_count} ({anomaly_count/steps*100:.1f}%)
- Final Fuel Level: {final_fuel:.1f}%
- Final Distance to Mars: {final_distance:.0f} km
- Mission Status: {'✅ SUCCESS' if final_fuel > 20 and anomaly_count < steps*0.3 else '⚠️ CAUTION'}
        """

    except Exception as e:
        return f"Error during simulation: {str(e)}"

# Create minimal interface
with gr.Blocks(title="GalactiMecha: Mars Navigation AI", theme=gr.themes.Soft()) as iface:

    gr.Markdown("""
    # 🚀 GalactiMecha: AI-Powered Mars Navigation System

    **Status:** {'✅ FULLY OPERATIONAL' if dependencies_available else '⚠️ DEMO MODE (Limited Dependencies)'}

    Experience the future of interstellar travel with our advanced AI navigation system.
    """)

    with gr.Row():
        with gr.Column():
            instruction_input = gr.Textbox(
                label="Mission Instructions",
                value="Safe Mars approach with fuel conservation",
                lines=2,
                placeholder="Enter natural language navigation instructions..."
            )
            steps_slider = gr.Slider(
                label="Simulation Steps",
                minimum=10,
                maximum=100,
                value=20,
                step=5
            )
            run_btn = gr.Button("🚀 Run Mission Simulation", variant="primary", size="lg")

        with gr.Column():
            results_output = gr.Markdown("""
### Simulation Results

*Click "Run Mission Simulation" to start your Mars navigation mission!*

**Features Available:**
- 🤖 AI-powered navigation guidance
- 🚨 Real-time anomaly detection
- ⛽ Fuel consumption modeling
- 📊 Mission performance analytics
- 🛡️ Cybersecurity resilience testing
            """)

    run_btn.click(
        run_quick_simulation,
        inputs=[instruction_input, steps_slider],
        outputs=results_output
    )

    if dependencies_available:
        gr.Markdown("""
### 🎯 System Capabilities

- **Natural Language Processing**: Convert text instructions to navigation vectors
- **Anomaly Detection**: Identify and respond to sensor anomalies
- **Trajectory Optimization**: Real-time path planning to Mars
- **Fuel Management**: Realistic consumption modeling
- **Mission Timeline**: Time-to-destination calculations
- **Drift Detection**: Monitor AI model reliability
- **Cybersecurity**: Demonstrate resilience against attacks
        """)
    else:
        gr.Markdown("""
### ⚠️ Demo Mode

Some dependencies are not available. The system is running in demo mode with limited functionality.
Full features require: transformers, torch, scikit-learn, and other ML libraries.
        """)

if __name__ == "__main__":
    iface.launch(share=False)