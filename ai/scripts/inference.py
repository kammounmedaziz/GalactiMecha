"""Inference script for GalactiMecha simulation."""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

import numpy as np
from ai.data.data_generator import generate_correct_data, inject_fake_data
from ai.modules.slm_module import slm
from ai.models.navigation import predict_next_move
from ai.modules.anomaly_detector import AnomalyDetector

def run_simulation(use_fake_data=False):
    """Run navigation simulation.

    Args:
        use_fake_data: Whether to inject fake data.
    """
    print("Generating data...")
    data = generate_correct_data(100)
    if use_fake_data:
        data = inject_fake_data(data, corruption_rate=0.2)

    # Fit anomaly detector on clean data
    detector = AnomalyDetector()
    clean_data = generate_correct_data(100)
    detector.fit(clean_data.drop(['timestamp', 'landing_zone_lat', 'landing_zone_lon'], axis=1).values)

    guidance = slm.interpret_instruction("Approach Mars from north trajectory with minimal fuel use")

    for i, row in data.iterrows():
        state = row.drop(['timestamp', 'landing_zone_lat', 'landing_zone_lon']).values
        anomaly = detector.detect(state)
        if anomaly == -1:
            print(f"Anomaly detected at step {i}")

        move = predict_next_move(state, guidance)
        print(f"Step {i}: Thrust/Orientation: {move}")

if __name__ == "__main__":
    run_simulation(use_fake_data=False)