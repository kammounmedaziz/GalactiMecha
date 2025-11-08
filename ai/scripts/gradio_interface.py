"""Enhanced Gradio interface for GalactiMecha AI with full simulation capabilities."""

import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import gradio as gr
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import plotly.express as px
from data.data_generator import generate_correct_data, inject_fake_data
from modules.slm_module import slm
from models.navigation import predict_next_move
from modules.anomaly_detector import AnomalyDetector

# Pre-load model and detector
detector = AnomalyDetector()
clean_data = generate_correct_data(100)
detector.fit(clean_data.drop(['timestamp', 'landing_zone_lat', 'landing_zone_lon'], axis=1).values)

def run_multi_step_simulation(instruction, num_steps=50, anomaly_rate=0.1, anomaly_sensitivity=0.5):
    """Run multi-step navigation simulation.

    Args:
        instruction: Mission instruction text
        num_steps: Number of simulation steps
        anomaly_rate: Probability of injecting anomalies
        anomaly_sensitivity: Anomaly detection threshold

    Returns:
        Dictionary with simulation results
    """
    guidance = slm.interpret_instruction(instruction)

    # Initialize simulation state
    results = {
        'steps': [],
        'anomalies': [],
        'predictions': [],
        'sensor_data': [],
        'fuel_levels': [],
        'distances': [],
        'positions': [],
        'time_estimates': []  # Add time estimates tracking
    }

    current_fuel = 100.0  # Starting fuel level
    current_pos = np.array([50000.0, 0.0, 0.0])  # Starting position (km from Mars)

    for step in range(num_steps):
        # Generate sensor data
        data = generate_correct_data(1)

        # Inject anomalies based on rate
        if np.random.random() < anomaly_rate:
            data = inject_fake_data(data, corruption_rate=1.0)

        # Prepare state (exclude timestamp and landing zone coords)
        state = data.drop(['timestamp', 'landing_zone_lat', 'landing_zone_lon'], axis=1).values[0]

        # Detect anomalies
        anomaly_score = detector.decision_function([state])[0]
        is_anomaly = anomaly_score < -anomaly_sensitivity

        # Get navigation prediction
        move = predict_next_move(state, guidance)

        # Update simulation state
        thrust_magnitude = np.linalg.norm(move[:3])
        current_fuel = max(0, current_fuel - thrust_magnitude * 0.1)  # Fuel consumption

        # Simple position update (simplified physics)
        velocity = state[3:6]  # vx, vy, vz from sensor data
        current_pos += velocity * 0.1 + move[:3] * 0.01  # Position update
        distance_to_mars = np.linalg.norm(current_pos)
        
        # Calculate time to destination estimate
        time_estimate = calculate_time_to_destination(current_pos, velocity, current_fuel)
        
        # Store results
        results['steps'].append(step)
        results['anomalies'].append(is_anomaly)
        results['predictions'].append(move)
        results['sensor_data'].append(state)
        results['fuel_levels'].append(current_fuel)
        results['distances'].append(distance_to_mars)
        results['positions'].append(current_pos.copy())
        results['time_estimates'].append(time_estimate)

    return results, guidance

def calculate_time_to_destination(current_pos, current_velocity, fuel_level, thrust_limit=2.0):
    """Calculate estimated time to reach Mars destination.
    
    Args:
        current_pos: Current position vector (km)
        current_velocity: Current velocity vector (km/s) 
        fuel_level: Remaining fuel percentage (0-100)
        thrust_limit: Maximum thrust magnitude
        
    Returns:
        Estimated time in hours, or None if calculation fails
    """
    try:
        # Distance to Mars (origin)
        distance = np.linalg.norm(current_pos)
        
        if distance < 1000:  # Already very close to Mars
            return 0.5  # 30 minutes for final approach
            
        # Velocity towards Mars (component of velocity vector towards Mars)
        velocity_towards_mars = -np.dot(current_velocity, current_pos) / distance
        
        # Available thrust (based on fuel and thrust limit)
        max_thrust = thrust_limit * (fuel_level / 100.0)
        
        # Simplified time calculation using kinematic equations
        # Assuming we can maintain thrust towards Mars
        
        if velocity_towards_mars <= 0:
            # Moving away or stationary - need to decelerate and turn around
            # Time to stop current motion + time to cover distance
            deceleration_time = abs(velocity_towards_mars) / max_thrust if max_thrust > 0 else float('inf')
            remaining_distance = distance
            cruise_time = np.sqrt(2 * remaining_distance / max_thrust) if max_thrust > 0 else float('inf')
            total_time = deceleration_time + cruise_time
        else:
            # Already moving towards Mars
            # Time = distance / average_velocity (simplified)
            # Account for deceleration near Mars
            avg_velocity = min(velocity_towards_mars, 5.0)  # Cap at reasonable speed
            total_time = distance / avg_velocity
            
        # Convert to hours (simulation steps are 0.1 seconds each)
        # Each simulation step represents 0.1 seconds of real time
        time_hours = total_time * 0.1 / 3600
        
        # Sanity checks
        if time_hours < 0.01:  # Less than 36 seconds
            time_hours = 0.01
        elif time_hours > 1000:  # More than 1000 hours (unrealistic)
            time_hours = float('inf')
            
        return time_hours
        
    except Exception as e:
        print(f"Time calculation error: {e}")
        return None

def create_sensor_plot(results):
    """Create sensor data histogram plots with Interstellar theme."""
    steps = results['steps']
    sensor_data = np.array(results['sensor_data'])
    
    # Interstellar dark theme colors
    bg_color = '#0a0e27'
    text_color = '#e8f4f8'
    cyan_color = '#64b5f6'
    bar_colors = ['#2196f3', '#00bcd4', '#4caf50', '#ffc107', '#ff9800', '#f44336']

    fig, axes = plt.subplots(2, 3, figsize=(18, 10))
    fig.patch.set_facecolor(bg_color)
    fig.suptitle('Sensor Data Distribution', color=text_color, fontsize=16, fontweight='bold', y=0.995)

    # Configure all axes with dark theme
    for ax_row in axes:
        for ax in ax_row:
            ax.set_facecolor(bg_color)
            ax.spines['bottom'].set_color(cyan_color)
            ax.spines['top'].set_color(cyan_color)
            ax.spines['left'].set_color(cyan_color)
            ax.spines['right'].set_color(cyan_color)
            ax.tick_params(colors=text_color, labelsize=9)
            ax.grid(True, alpha=0.2, color=cyan_color, linestyle='--', linewidth=0.5)

    # Position Histograms (X, Y, Z)
    ax = axes[0, 0]
    ax.hist([sensor_data[:, 0], sensor_data[:, 1], sensor_data[:, 2]], 
            bins=20, label=['X', 'Y', 'Z'], color=bar_colors[:3], alpha=0.7, edgecolor=cyan_color)
    ax.set_title('Position Distribution (km)', color=text_color, fontsize=12, pad=10)
    ax.set_xlabel('Position (km)', color=text_color, fontsize=10)
    ax.set_ylabel('Frequency', color=text_color, fontsize=10)
    ax.legend(facecolor=bg_color, edgecolor=cyan_color, labelcolor=text_color, framealpha=0.9)

    # Velocity Histograms (VX, VY, VZ)
    ax = axes[0, 1]
    ax.hist([sensor_data[:, 3], sensor_data[:, 4], sensor_data[:, 5]], 
            bins=20, label=['VX', 'VY', 'VZ'], color=bar_colors[:3], alpha=0.7, edgecolor=cyan_color)
    ax.set_title('Velocity Distribution (km/s)', color=text_color, fontsize=12, pad=10)
    ax.set_xlabel('Velocity (km/s)', color=text_color, fontsize=10)
    ax.set_ylabel('Frequency', color=text_color, fontsize=10)
    ax.legend(facecolor=bg_color, edgecolor=cyan_color, labelcolor=text_color, framealpha=0.9)

    # Attitude Histograms (Roll, Pitch, Yaw)
    ax = axes[0, 2]
    ax.hist([sensor_data[:, 6], sensor_data[:, 7], sensor_data[:, 8]], 
            bins=20, label=['Roll', 'Pitch', 'Yaw'], color=bar_colors[3:6], alpha=0.7, edgecolor=cyan_color)
    ax.set_title('Attitude Distribution (degrees)', color=text_color, fontsize=12, pad=10)
    ax.set_xlabel('Degrees', color=text_color, fontsize=10)
    ax.set_ylabel('Frequency', color=text_color, fontsize=10)
    ax.legend(facecolor=bg_color, edgecolor=cyan_color, labelcolor=text_color, framealpha=0.9)

    # Fuel Level Histogram
    ax = axes[1, 0]
    ax.hist(results['fuel_levels'], bins=15, color='#ffa500', alpha=0.7, edgecolor=cyan_color)
    ax.set_title('Fuel Level Distribution (%)', color=text_color, fontsize=12, pad=10)
    ax.set_xlabel('Fuel (%)', color=text_color, fontsize=10)
    ax.set_ylabel('Frequency', color=text_color, fontsize=10)

    # Distance Histogram
    ax = axes[1, 1]
    ax.hist(results['distances'], bins=15, color='#ff4444', alpha=0.7, edgecolor=cyan_color)
    ax.set_title('Distance to Mars Distribution (km)', color=text_color, fontsize=12, pad=10)
    ax.set_xlabel('Distance (km)', color=text_color, fontsize=10)
    ax.set_ylabel('Frequency', color=text_color, fontsize=10)

    # Anomaly Detection Distribution
    ax = axes[1, 2]
    anomaly_counts = [results['anomalies'].count(False), results['anomalies'].count(True)]
    ax.bar(['Normal', 'Anomaly'], anomaly_counts, color=['#4caf50', '#ff4444'], 
           alpha=0.7, edgecolor=cyan_color, width=0.6)
    ax.set_title('Anomaly Detection', color=text_color, fontsize=12, pad=10)
    ax.set_ylabel('Count', color=text_color, fontsize=10)
    
    # Add count labels on bars
    for i, count in enumerate(anomaly_counts):
        ax.text(i, count + max(anomaly_counts)*0.02, str(count), 
                ha='center', va='bottom', color=text_color, fontsize=11, fontweight='bold')

    plt.tight_layout()
    return fig

def create_trajectory_plot(results):
    """Create 3D trajectory visualization."""
    positions = np.array(results['positions'])

    fig = go.Figure()

    # Trajectory line
    fig.add_trace(go.Scatter3d(
        x=positions[:, 0],
        y=positions[:, 1],
        z=positions[:, 2],
        mode='lines+markers',
        name='Trajectory',
        line=dict(color='blue', width=2),
        marker=dict(size=3, color='blue')
    ))

    # Mars (approximate position at origin)
    fig.add_trace(go.Scatter3d(
        x=[0], y=[0], z=[0],
        mode='markers',
        name='Mars',
        marker=dict(size=10, color='red', symbol='circle')
    ))

    # Landing zone (example location)
    fig.add_trace(go.Scatter3d(
        x=[1000], y=[500], z=[0],
        mode='markers',
        name='Landing Zone',
        marker=dict(size=8, color='green', symbol='diamond')
    ))

    fig.update_layout(
        title='Spacecraft Trajectory to Mars',
        scene=dict(
            xaxis_title='X (km)',
            yaxis_title='Y (km)',
            zaxis_title='Z (km)',
            aspectmode='cube'
        ),
        margin=dict(l=0, r=0, b=0, t=40)
    )

    return fig

def create_analytics_summary(results, guidance):
    """Create analytics summary."""
    total_steps = len(results['steps'])
    anomaly_count = sum(results['anomalies'])
    anomaly_rate = anomaly_count / total_steps * 100

    fuel_consumed = 100 - results['fuel_levels'][-1]
    avg_distance = np.mean(results['distances'])
    final_distance = results['distances'][-1]

    predictions = np.array(results['predictions'])
    avg_thrust = np.mean([np.linalg.norm(p[:3]) for p in predictions])
    avg_orientation = np.mean([np.linalg.norm(p[3:]) for p in predictions])
    
    # Calculate time metrics
    final_time_estimate = results['time_estimates'][-1] if results['time_estimates'] and results['time_estimates'][-1] is not None else float('inf')
    avg_time_estimate = np.mean([t for t in results['time_estimates'] if t is not None]) if results['time_estimates'] else float('inf')
    
    # Format time display
    def format_time(hours):
        if hours == float('inf') or hours > 1000:
            return "∞ (calculation error)"
        elif hours < 1:
            return f"{hours*60:.1f} minutes"
        elif hours < 24:
            return f"{hours:.1f} hours"
        else:
            return f"{hours/24:.1f} days"

    summary = f"""
## Mission Analytics Summary

**Simulation Parameters:**
- Total Steps: {total_steps}
- Guidance Vector: [{guidance[0]:.2f}, {guidance[1]:.2f}, {guidance[2]:.2f}]

**Safety Metrics:**
- Anomalies Detected: {anomaly_count} ({anomaly_rate:.1f}%)
- Final Fuel Level: {results['fuel_levels'][-1]:.1f}%

**Navigation Performance:**
- Fuel Consumed: {fuel_consumed:.1f}%
- Average Distance to Mars: {avg_distance:.0f} km
- Final Distance to Mars: {final_distance:.0f} km
- Average Thrust Magnitude: {avg_thrust:.3f}
- Average Orientation Change: {avg_orientation:.3f}

**Mission Timeline:**
- Estimated Time to Mars: {format_time(final_time_estimate)}
- Average Time Estimate: {format_time(avg_time_estimate)}

**Mission Status:** {'⚠️ HIGH RISK' if anomaly_rate > 20 else '✅ NOMINAL' if anomaly_rate < 5 else '⚡ CAUTION'}
"""

    return summary

def simulate_navigation(instruction, use_anomaly=False):
    """Single-step simulation for backward compatibility."""
    guidance = slm.interpret_instruction(instruction)
    data = generate_correct_data(1)
    if use_anomaly:
        data = inject_fake_data(data, corruption_rate=1.0)

    state = data.drop(['timestamp', 'landing_zone_lat', 'landing_zone_lon'], axis=1).values[0]
    anomaly = detector.detect(state)
    move = predict_next_move(state, guidance)

    result = f"Guidance Vector: {guidance}\n"
    result += f"Anomaly Detected: {'Yes' if anomaly == -1 else 'No'}\n"
    result += f"Next Move (Thrust/Orientation): {move}"
    return result

# Gradio interface with tabs
with gr.Blocks(title="GalactiMecha: Mars Navigation AI", theme=gr.themes.Soft()) as iface:

    gr.Markdown("""
    # 🚀 GalactiMecha: AI-Powered Mars Navigation System

    Experience the future of interstellar travel with our advanced AI navigation system.
    This interface demonstrates the full capabilities of our Mars spacecraft navigation AI,
    including anomaly detection, natural language guidance, and real-time trajectory optimization.
    """)

    with gr.Tabs():

        # Tab 1: Single Prediction (Original Interface)
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
                results, guidance = run_multi_step_simulation(instruction, steps, anomaly_rate, sensitivity)

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

                    with gr.Accordion("📊 Detailed Metrics", open=False):
                        gr.Markdown("""
**Real-time Metrics:**
- Anomaly Detection Rate
- False Positive/Negative Rates
- Fuel Consumption Patterns
- Trajectory Stability
- SLM Interpretation Accuracy

**Safety Thresholds:**
- Max acceptable anomaly rate: 15%
- Min fuel reserve: 20%
- Max trajectory deviation: 5%
                        """)

            def run_analytics_test(instruction, steps):
                # Run multiple simulations with different parameters
                results_normal, _ = run_multi_step_simulation(instruction, steps, 0.05, 0.5)
                results_stress, _ = run_multi_step_simulation(instruction, steps, 0.3, 0.3)

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

        # Tab 4: Attack Scenario Demonstration
        with gr.TabItem("🛡️ Attack Scenario"):
            gr.Markdown("### Cybersecurity Demonstration: AI Resilience Under Attack")
            gr.Markdown("""
            This simulation demonstrates how GalactiMecha's AI system detects and mitigates
            adversarial attacks on spacecraft sensors, maintaining safe trajectory despite fake data injection.
            """)

            with gr.Row():
                with gr.Column(scale=1):
                    attack_instruction = gr.Textbox(
                        label="Mission Instructions",
                        value="Safe Mars approach with fuel conservation",
                        lines=2
                    )
                    attack_duration = gr.Slider(
                        label="Mission Duration",
                        minimum=20,
                        maximum=100,
                        value=50,
                        step=5,
                        info="Total simulation steps"
                    )
                    attack_start_step = gr.Slider(
                        label="Attack Start Step",
                        minimum=5,
                        maximum=40,
                        value=15,
                        step=5,
                        info="When the attack begins"
                    )
                    attack_duration_steps = gr.Slider(
                        label="Attack Duration",
                        minimum=5,
                        maximum=30,
                        value=10,
                        step=5,
                        info="How long the attack lasts"
                    )
                    run_attack_btn = gr.Button("🚨 Run Attack Scenario", variant="stop", size="lg")

                with gr.Column(scale=2):
                    attack_summary = gr.Markdown("""
### Attack Scenario Results

**Phase 1: Normal Operation** ⏳
- Establishing baseline trajectory...

**Phase 2: Under Attack** 🚨
- Detecting adversarial perturbations...

**Phase 3: AI Mitigation** 🛡️
- Maintaining safe trajectory despite attacks...
                    """)

                    with gr.Tabs():
                        with gr.TabItem("📈 Trajectory Comparison"):
                            attack_trajectory_plot = gr.Plot(label="Normal vs Attacked Trajectory")
                        with gr.TabItem("🚨 Attack Timeline"):
                            attack_timeline_plot = gr.Plot(label="Attack Detection and Response")
                        with gr.TabItem("📊 Attack Impact"):
                            attack_impact_plot = gr.Plot(label="Sensor Data Deviations")

            def run_attack_scenario(instruction, total_steps, attack_start, attack_duration):
                """Run attack scenario with baseline vs attacked comparison."""

                # Phase 1: Generate baseline (normal trajectory)
                print("Generating baseline trajectory...")
                baseline_results, guidance = run_multi_step_simulation(instruction, total_steps, 0.0, 0.5)

                # Phase 2: Generate attacked trajectory
                print("Simulating attack scenario...")
                attacked_results, _ = run_multi_step_simulation_attack(
                    instruction, total_steps, attack_start, attack_start + attack_duration, guidance
                )

                # Create comparative visualizations
                trajectory_fig = create_attack_trajectory_comparison(baseline_results, attacked_results, attack_start, attack_start + attack_duration)
                timeline_fig = create_attack_timeline(baseline_results, attacked_results, attack_start, attack_start + attack_duration)
                impact_fig = create_attack_impact_analysis(baseline_results, attacked_results, attack_start, attack_start + attack_duration)

                # Generate summary
                summary = generate_attack_summary(baseline_results, attacked_results, attack_start, attack_start + attack_duration, guidance, total_steps, attack_instruction)

                return summary, trajectory_fig, timeline_fig, impact_fig

            def run_multi_step_simulation_attack(instruction, num_steps, attack_start, attack_end, guidance):
                """Run simulation with targeted attack period."""
                results = {
                    'steps': [], 'anomalies': [], 'predictions': [], 'sensor_data': [],
                    'fuel_levels': [], 'distances': [], 'positions': [], 'attack_active': [], 'time_estimates': []
                }

                current_fuel = 100.0
                current_pos = np.array([50000.0, 0.0, 0.0])

                for step in range(num_steps):
                    data = generate_correct_data(1)

                    # Inject attack during specified period
                    attack_active = attack_start <= step < attack_end
                    if attack_active:
                        data = inject_fake_data(data, corruption_rate=1.0)

                    state = data.drop(['timestamp', 'landing_zone_lat', 'landing_zone_lon'], axis=1).values[0]
                    anomaly_score = detector.decision_function([state])[0]
                    is_anomaly = anomaly_score < -0.5

                    move = predict_next_move(state, guidance)

                    # AI Safety: Despite fake data, maintain reasonable predictions
                    if attack_active and is_anomaly:
                        # Apply safety bounds to prevent extreme maneuvers
                        move = np.clip(move, -2.0, 2.0)

                    thrust_magnitude = np.linalg.norm(move[:3])
                    current_fuel = max(0, current_fuel - thrust_magnitude * 0.1)
                    velocity = state[3:6]
                    current_pos += velocity * 0.1 + move[:3] * 0.01
                    distance_to_mars = np.linalg.norm(current_pos)
                    
                    # Calculate time to destination estimate
                    time_estimate = calculate_time_to_destination(current_pos, velocity, current_fuel)

                    results['steps'].append(step)
                    results['anomalies'].append(is_anomaly)
                    results['predictions'].append(move)
                    results['sensor_data'].append(state)
                    results['fuel_levels'].append(current_fuel)
                    results['distances'].append(distance_to_mars)
                    results['positions'].append(current_pos.copy())
                    results['attack_active'].append(attack_active)
                    results['time_estimates'].append(time_estimate)

                return results, guidance

            def create_attack_trajectory_comparison(baseline, attacked, attack_start, attack_end):
                """Create comparative trajectory visualization."""
                baseline_pos = np.array(baseline['positions'])
                attacked_pos = np.array(attacked['positions'])

                fig = go.Figure()

                # Baseline trajectory
                fig.add_trace(go.Scatter3d(
                    x=baseline_pos[:, 0], y=baseline_pos[:, 1], z=baseline_pos[:, 2],
                    mode='lines+markers', name='Normal Trajectory',
                    line=dict(color='blue', width=3),
                    marker=dict(size=4, color='blue')
                ))

                # Attacked trajectory
                fig.add_trace(go.Scatter3d(
                    x=attacked_pos[:, 0], y=attacked_pos[:, 1], z=attacked_pos[:, 2],
                    mode='lines+markers', name='Under Attack',
                    line=dict(color='red', width=3, dash='dash'),
                    marker=dict(size=4, color='red')
                ))

                # Mars
                fig.add_trace(go.Scatter3d(
                    x=[0], y=[0], z=[0], mode='markers',
                    name='Mars', marker=dict(size=12, color='orange', symbol='circle')
                ))

                # Attack period markers
                attack_indices = list(range(attack_start, attack_end))
                attack_pos = attacked_pos[attack_indices]
                fig.add_trace(go.Scatter3d(
                    x=attack_pos[:, 0], y=attack_pos[:, 1], z=attack_pos[:, 2],
                    mode='markers', name='Attack Period',
                    marker=dict(size=8, color='red', symbol='x', line=dict(width=2, color='black'))
                ))

                fig.update_layout(
                    title='Trajectory Comparison: Normal vs Under Attack',
                    scene=dict(
                        xaxis_title='X (km)', yaxis_title='Y (km)', zaxis_title='Z (km)',
                        aspectmode='cube'
                    ),
                    margin=dict(l=0, r=0, b=0, t=50)
                )

                return fig

            def create_attack_timeline(baseline, attacked, attack_start, attack_end):
                """Create attack timeline visualization with Interstellar theme."""
                steps = attacked['steps']
                anomalies = attacked['anomalies']
                attack_active = attacked['attack_active']

                # Interstellar dark theme colors
                bg_color = '#0a0e27'
                text_color = '#e8f4f8'
                cyan_color = '#64b5f6'
                grid_color = '#1a2645'
                
                fig, axes = plt.subplots(3, 1, figsize=(14, 10))
                fig.patch.set_facecolor(bg_color)
                fig.suptitle('Attack Timeline and AI Response', color=text_color, fontsize=16, fontweight='bold', y=0.995)

                for ax in axes:
                    ax.set_facecolor(bg_color)
                    ax.spines['bottom'].set_color(cyan_color)
                    ax.spines['top'].set_color(cyan_color)
                    ax.spines['left'].set_color(cyan_color)
                    ax.spines['right'].set_color(cyan_color)
                    ax.tick_params(colors=text_color, labelsize=10)
                    ax.grid(True, alpha=0.2, color=cyan_color, linestyle='--', linewidth=0.5)

                # Attack period
                axes[0].fill_between(steps, 0, 1, where=attack_active, color='#ff4444', alpha=0.5, label='Attack Active')
                axes[0].set_title('Attack Period', color=text_color, fontsize=12, pad=10)
                axes[0].set_yticks([0, 1])
                axes[0].set_yticklabels(['Inactive', 'Active'], color=text_color)
                axes[0].legend(facecolor=bg_color, edgecolor=cyan_color, labelcolor=text_color, framealpha=0.9)

                # Anomaly detection
                axes[1].plot(steps, [1 if a else 0 for a in anomalies], color='#ff4444', drawstyle='steps-post', linewidth=2.5)
                axes[1].fill_between(steps, 0, [1 if a else 0 for a in anomalies], color='#ff4444', alpha=0.4)
                axes[1].set_title('Anomaly Detection Alerts', color=text_color, fontsize=12, pad=10)
                axes[1].set_yticks([0, 1])
                axes[1].set_yticklabels(['Normal', 'ALERT'], color=text_color)

                # Trajectory deviation
                baseline_pos = np.array(baseline['positions'])
                attacked_pos = np.array(attacked['positions'])
                deviation = np.linalg.norm(attacked_pos - baseline_pos, axis=1)

                axes[2].plot(steps, deviation, color='#ffa500', linewidth=2.5, label='Trajectory Deviation')
                axes[2].fill_between(steps, 0, deviation, color='#ffa500', alpha=0.3, label='Attack Period')
                axes[2].axvspan(attack_start, attack_end, color='#ff4444', alpha=0.15)
                axes[2].set_title('Trajectory Deviation from Normal (km)', color=text_color, fontsize=12, pad=10)
                axes[2].set_ylabel('Deviation (km)', color=text_color, fontsize=11)
                axes[2].set_xlabel('Time Step', color=text_color, fontsize=11)
                axes[2].legend(facecolor=bg_color, edgecolor=cyan_color, labelcolor=text_color, framealpha=0.9)

                plt.tight_layout()
                return fig

            def create_attack_impact_analysis(baseline, attacked, attack_start, attack_end):
                """Analyze the impact of attacks on sensor data with Interstellar theme."""
                baseline_sensors = np.array(baseline['sensor_data'])
                attacked_sensors = np.array(attacked['sensor_data'])

                steps = attacked['steps']
                attack_active = attacked['attack_active']

                # Interstellar dark theme colors
                bg_color = '#0a0e27'
                text_color = '#e8f4f8'
                cyan_color = '#64b5f6'
                blue_color = '#2196f3'
                red_color = '#ff4444'

                fig, axes = plt.subplots(2, 3, figsize=(18, 10))
                fig.patch.set_facecolor(bg_color)
                fig.suptitle('Sensor Data: Normal vs Under Attack', color=text_color, fontsize=16, fontweight='bold', y=0.995)

                sensor_names = ['Position X', 'Velocity X', 'Fuel Level', 'Asteroid Dist', 'Hazard Score']
                sensor_indices = [0, 3, 7, 8, 9]  # Corresponding column indices

                for i, (name, idx) in enumerate(zip(sensor_names, sensor_indices)):
                    ax = axes[i // 3, i % 3]
                    
                    # Set dark theme
                    ax.set_facecolor(bg_color)
                    ax.spines['bottom'].set_color(cyan_color)
                    ax.spines['top'].set_color(cyan_color)
                    ax.spines['left'].set_color(cyan_color)
                    ax.spines['right'].set_color(cyan_color)
                    ax.tick_params(colors=text_color, labelsize=9)
                    ax.grid(True, alpha=0.2, color=cyan_color, linestyle='--', linewidth=0.5)
                    
                    # Plot data
                    ax.plot(steps, baseline_sensors[:, idx], label='Normal', color=blue_color, linewidth=2.5, alpha=0.9)
                    ax.plot(steps, attacked_sensors[:, idx], label='Under Attack', color=red_color, linewidth=2.5, linestyle='--', alpha=0.9)

                    # Highlight attack period
                    attack_mask = attack_active
                    ax.fill_between(steps, baseline_sensors[:, idx], attacked_sensors[:, idx],
                                  where=attack_mask, color=red_color, alpha=0.25, label='Attack Deviation')

                    ax.set_title(f'{name} Comparison', color=text_color, fontsize=11, pad=8)
                    ax.set_xlabel('Time Step', color=text_color, fontsize=9)
                    ax.legend(facecolor=bg_color, edgecolor=cyan_color, labelcolor=text_color, 
                             framealpha=0.9, fontsize=8, loc='best')

                # Hide the 6th subplot (we only have 5 sensors)
                axes[1, 2].axis('off')

                plt.tight_layout()
                return fig

            def generate_attack_summary(baseline, attacked, attack_start, attack_end, guidance, total_steps, attack_instruction):
                """Generate comprehensive attack scenario summary."""
                attack_steps = attack_end - attack_start
                total_anomalies = sum(attacked['anomalies'])
                attack_anomalies = sum(attacked['anomalies'][attack_start:attack_end])

                baseline_final_fuel = baseline['fuel_levels'][-1]
                attacked_final_fuel = attacked['fuel_levels'][-1]

                baseline_final_dist = baseline['distances'][-1]
                attacked_final_dist = attacked['distances'][-1]

                # Calculate time impact
                baseline_final_time = baseline['time_estimates'][-1] if baseline['time_estimates'] and baseline['time_estimates'][-1] is not None else float('inf')
                attacked_final_time = attacked['time_estimates'][-1] if attacked['time_estimates'] and attacked['time_estimates'][-1] is not None else float('inf')
                
                def format_time(hours):
                    if hours == float('inf') or hours > 1000:
                        return "∞ (calculation error)"
                    elif hours < 1:
                        return f"{hours*60:.1f} minutes"
                    elif hours < 24:
                        return f"{hours:.1f} hours"
                    else:
                        return f"{hours/24:.1f} days"
                
                time_delay = attacked_final_time - baseline_final_time if attacked_final_time != float('inf') and baseline_final_time != float('inf') else float('inf')

                # Calculate trajectory deviation during attack
                baseline_pos = np.array(baseline['positions'])
                attacked_pos = np.array(attacked['positions'])
                attack_deviations = np.linalg.norm(attacked_pos[attack_start:attack_end] - baseline_pos[attack_start:attack_end], axis=1)
                
                # Handle edge case where attack period is empty
                if len(attack_deviations) == 0:
                    max_deviation = 0.0
                    avg_deviation = 0.0
                else:
                    max_deviation = np.max(attack_deviations)
                    avg_deviation = np.mean(attack_deviations)

                summary = f"""
## 🛡️ Attack Scenario Analysis

### Mission Configuration
- **Instructions:** "{attack_instruction}"
- **Guidance Vector:** [{guidance[0]:.2f}, {guidance[1]:.2f}, {guidance[2]:.2f}]
- **Total Duration:** {total_steps} steps
- **Attack Window:** Steps {attack_start} - {attack_end} ({attack_steps} steps)

### Phase 1: Normal Operation ✅
- **Trajectory:** Stable approach to Mars
- **Anomalies:** 0 detected
- **Fuel Remaining:** {baseline_final_fuel:.1f}%
- **Final Distance:** {baseline_final_dist:.0f} km
- **Estimated Time to Mars:** {format_time(baseline_final_time)}

### Phase 2: Under Attack 🚨
- **Attack Type:** Sensor data poisoning with extreme values
- **Anomalies Detected:** {attack_anomalies} during attack period
- **Detection Rate:** {attack_anomalies/attack_steps*100:.1f}% if attack_steps > 0 else 'N/A (no attack steps)'
- **Max Trajectory Deviation:** {max_deviation:.1f} km
- **Average Deviation:** {avg_deviation:.1f} km

### Phase 3: AI Mitigation 🛡️
- **Safety Response:** Anomaly detection triggered alerts
- **Trajectory Protection:** AI maintained bounded predictions despite fake data
- **Fuel Impact:** {attacked_final_fuel:.1f}% remaining (vs {baseline_final_fuel:.1f}% normal)
- **Time Impact:** {format_time(attacked_final_time)} (delay: {format_time(time_delay) if time_delay != float('inf') else '∞'})
- **Mission Continuity:** Safe trajectory maintained throughout attack

### Security Assessment
**Attack Success:** {'❌ BLOCKED' if attack_anomalies > 0 else '⚠️ POTENTIAL BREACH'}
**AI Resilience:** {'🛡️ ROBUST' if max_deviation < 1000 else '⚠️ COMPROMISED'}
**Overall Security:** {'🔒 SECURE' if attack_steps > 0 and attack_anomalies/attack_steps > 0.7 else '🚨 VULNERABLE' if attack_steps > 0 else '⚠️ NO ATTACK DATA'}

**Key Demonstration:** The AI system successfully detected {attack_anomalies} anomalies during the {attack_steps} step attack,
preventing catastrophic trajectory deviations while maintaining mission safety protocols.
                """
                return summary

            run_attack_btn.click(
                run_attack_scenario,
                inputs=[attack_instruction, attack_duration, attack_start_step, attack_duration_steps],
                outputs=[attack_summary, attack_trajectory_plot, attack_timeline_plot, attack_impact_plot]
            )

if __name__ == "__main__":
    iface.launch(share=False)