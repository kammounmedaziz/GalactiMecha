"""Launcher script for GalactiMecha Gradio interface with deferred imports."""

import os
import sys
import gradio as gr
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import plotly.express as px

# Add project root to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

def create_interface():
    """Create the Gradio interface with lazy imports."""

    # Lazy import of heavy dependencies
    try:
        from data.data_generator import generate_correct_data, inject_fake_data
        from modules.slm_module import slm
        from models.navigation import predict_next_move
        from modules.anomaly_detector import AnomalyDetector
        from utils.drift import detect_drift

        # Pre-load model and detector
        detector = AnomalyDetector()
        clean_data = generate_correct_data(100)
        detector.fit(clean_data.drop(['timestamp', 'landing_zone_lat', 'landing_zone_lon'], axis=1).values)

        dependencies_loaded = True
        error_message = None

    except Exception as e:
        dependencies_loaded = False
        error_message = str(e)
        print(f"Warning: Some dependencies failed to load: {e}")

        # Create dummy objects for when dependencies fail
        class DummySLM:
            def interpret_instruction(self, instruction):
                return np.array([0.1, 0.2, 0.3])

        class DummyDetector:
            def decision_function(self, data):
                return np.array([[0.0]] * len(data))
            def detect(self, data):
                return 1

        class DummyPredictor:
            def __call__(self, state, guidance):
                return np.random.normal(0, 0.5, 6)

        slm = DummySLM()
        detector = DummyDetector()
        predict_next_move = DummyPredictor()
        detect_drift = lambda *args: {"drift_detected": False, "confidence": 0.0}

    # Import the simulation functions (defined below)
    from simulation_functions import (
        run_multi_step_simulation,
        create_sensor_plot,
        create_trajectory_plot,
        create_analytics_summary,
        simulate_navigation,
        run_attack_scenario
    )

    # Create the interface
    with gr.Blocks(title="GalactiMecha: Mars Navigation AI", theme=gr.themes.Soft()) as iface:

        if not dependencies_loaded:
            gr.Markdown(f"""
            # 🚨 Dependency Loading Issue

            Some dependencies failed to load: {error_message}

            The interface will run in demo mode with limited functionality.
            """)

        gr.Markdown("""
        # 🚀 GalactiMecha: AI-Powered Mars Navigation System

        Experience the future of interstellar travel with our advanced AI navigation system.
        This interface demonstrates the full capabilities of our Mars spacecraft navigation AI,
        including anomaly detection, natural language guidance, and real-time trajectory optimization.
        """)

        with gr.Tabs():

            # Tab 1: Single Prediction
            with gr.TabItem("🔍 Single Prediction"):
                gr.Markdown("### Quick Navigation Prediction")
                gr.Markdown("Test individual navigation decisions with anomaly injection.")

                with gr.Row():
                    with gr.Column(scale=1):
                        instruction_input = gr.Textbox(
                            label="Mission Instruction",
                            value="Approach Mars from north trajectory with minimal fuel use",
                            lines=2,
                            placeholder="Enter natural language navigation instructions..."
                        )
                        anomaly_checkbox = gr.Checkbox(
                            label="Inject Anomaly",
                            info="Force an anomalous sensor reading for testing"
                        )
                        predict_btn = gr.Button("🚀 Predict Navigation", variant="primary")

                    with gr.Column(scale=1):
                        prediction_output = gr.Textbox(
                            label="Navigation Prediction",
                            lines=6,
                            show_copy_button=True
                        )

                predict_btn.click(
                    simulate_navigation,
                    inputs=[instruction_input, anomaly_checkbox],
                    outputs=prediction_output
                )

            # Tab 2: Full Simulation
            with gr.TabItem("🌌 Full Mission Simulation"):
                gr.Markdown("### Complete Mars Approach Simulation")
                gr.Markdown("Run multi-step simulations with real-time anomaly detection and trajectory tracking.")

                with gr.Row():
                    with gr.Column(scale=1):
                        sim_instruction = gr.Textbox(
                            label="Mission Instructions",
                            value="Execute safe Mars approach with conservative fuel usage",
                            lines=2
                        )
                        sim_steps = gr.Slider(
                            label="Simulation Steps",
                            minimum=10,
                            maximum=200,
                            value=50,
                            step=10,
                            info="Number of navigation steps to simulate"
                        )
                        sim_anomaly_rate = gr.Slider(
                            label="Anomaly Injection Rate",
                            minimum=0.0,
                            maximum=0.5,
                            value=0.1,
                            step=0.05,
                            info="Probability of anomalies per step"
                        )
                        sim_sensitivity = gr.Slider(
                            label="Anomaly Detection Sensitivity",
                            minimum=0.1,
                            maximum=2.0,
                            value=0.5,
                            step=0.1,
                            info="Lower = more sensitive detection"
                        )
                        run_sim_btn = gr.Button("🚀 Run Full Simulation", variant="primary", size="lg")

                    with gr.Column(scale=2):
                        sim_summary = gr.Markdown("### Simulation Results\n*Run a simulation to see results here*")
                        with gr.Tabs():
                            with gr.TabItem("📊 Sensor Timeline"):
                                sensor_plot = gr.Plot(label="Sensor Data Over Time")
                            with gr.TabItem("🗺️ Trajectory"):
                                trajectory_plot = gr.Plot(label="3D Trajectory Visualization")
                            with gr.TabItem("📋 Step Details"):
                                step_details = gr.Dataframe(
                                    headers=["Step", "Anomaly", "Thrust_X", "Thrust_Y", "Thrust_Z", "Roll", "Pitch", "Yaw", "Fuel", "Distance"],
                                    label="Detailed Step-by-Step Results"
                                )

                def run_simulation(instruction, steps, anomaly_rate, sensitivity):
                    results, guidance = run_multi_step_simulation(instruction, steps, anomaly_rate, sensitivity, slm, detector, predict_next_move)

                    # Create summary
                    summary = create_analytics_summary(results, guidance)

                    # Create plots
                    sensor_fig = create_sensor_plot(results)
                    traj_fig = create_trajectory_plot(results)

                    # Create dataframe
                    df_data = []
                    for i, (step, anomaly, pred, fuel, dist) in enumerate(zip(
                        results['steps'], results['anomalies'],
                        results['predictions'], results['fuel_levels'], results['distances']
                    )):
                        df_data.append([
                            step,
                            "Yes" if anomaly else "No",
                            f"{pred[0]:.3f}", f"{pred[1]:.3f}", f"{pred[2]:.3f}",
                            f"{pred[3]:.3f}", f"{pred[4]:.3f}", f"{pred[5]:.3f}",
                            f"{fuel:.1f}%",
                            f"{dist:.0f} km"
                        ])

                    return summary, sensor_fig, traj_fig, df_data

                run_sim_btn.click(
                    run_simulation,
                    inputs=[sim_instruction, sim_steps, sim_anomaly_rate, sim_sensitivity],
                    outputs=[sim_summary, sensor_plot, trajectory_plot, step_details]
                )

            # Tab 3: Analytics Dashboard
            with gr.TabItem("📈 Analytics & Safety"):
                gr.Markdown("### Mission Safety Analytics")
                gr.Markdown("Comprehensive analysis of navigation performance, safety metrics, and AI decision quality.")

                with gr.Row():
                    with gr.Column():
                        analytics_instruction = gr.Textbox(
                            label="Test Instructions",
                            value="Compare different navigation approaches",
                            lines=2
                        )
                        analytics_steps = gr.Slider(
                            label="Test Duration",
                            minimum=20,
                            maximum=100,
                            value=50,
                            step=10
                        )
                        run_analytics_btn = gr.Button("🔬 Run Analytics", variant="secondary")

                    with gr.Column():
                        analytics_output = gr.Markdown("""
### Performance Metrics

**Safety Score:** Calculating...
**Fuel Efficiency:** Calculating...
**Navigation Accuracy:** Calculating...
**Anomaly Response:** Calculating...

*Run analytics to see detailed performance metrics*
                        """)

                def run_analytics_test(instruction, steps):
                    # Run multiple simulations with different parameters
                    results_normal, _ = run_multi_step_simulation(instruction, steps, 0.05, 0.5, slm, detector, predict_next_move)
                    results_stress, _ = run_multi_step_simulation(instruction, steps, 0.3, 0.3, slm, detector, predict_next_move)

                    normal_anomalies = sum(results_normal['anomalies']) / len(results_normal['anomalies']) * 100
                    stress_anomalies = sum(results_stress['anomalies']) / len(results_stress['anomalies']) * 100

                    normal_fuel = results_normal['fuel_levels'][-1]
                    stress_fuel = results_stress['fuel_levels'][-1]

                    analytics = f"""
### 🚀 Analytics Results

**Test Configuration:**
- Instructions: "{instruction}"
- Duration: {steps} steps

**Safety Performance:**
- Normal Conditions: {normal_anomalies:.1f}% anomalies detected
- Stress Conditions: {stress_anomalies:.1f}% anomalies detected
- Anomaly Detection: {'✅ Excellent' if stress_anomalies > 25 else '⚠️ Needs Tuning'}

**Fuel Efficiency:**
- Normal Conditions: {normal_fuel:.1f}% fuel remaining
- Stress Conditions: {stress_fuel:.1f}% fuel remaining
- Efficiency Rating: {'🔋 Excellent' if normal_fuel > 70 else '⚡ Good' if normal_fuel > 50 else '⛽ Needs Optimization'}

**Overall Assessment:**
{'🟢 MISSION READY' if normal_anomalies < 10 and normal_fuel > 60 else '🟡 REQUIRES TUNING' if normal_anomalies < 20 else '🔴 SAFETY CONCERNS'}
                    """
                    return analytics

                run_analytics_btn.click(
                    run_analytics_test,
                    inputs=[analytics_instruction, analytics_steps],
                    outputs=analytics_output
                )

    return iface

if __name__ == "__main__":
    iface = create_interface()
    iface.launch(share=False)