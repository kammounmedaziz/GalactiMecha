"""Data generator for GalactiMecha Mars mission simulation."""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_correct_data(num_samples=1000):
    """Generate simulated normal Mars mission telemetry data.

    Features: position_x, position_y, position_z, velocity_x, velocity_y, velocity_z,
              acceleration, fuel_level, asteroid_distance, hazard_score, timestamp, landing_zone_coords

    Args:
        num_samples: Number of data points to generate.

    Returns:
        pandas DataFrame with simulated data.
    """
    np.random.seed(42)  # For reproducibility

    # Generate timestamps
    start_time = datetime.now()
    timestamps = [start_time + timedelta(seconds=i) for i in range(num_samples)]

    # Simulate positions (in km, approaching Mars)
    position_x = np.linspace(100000, 1000, num_samples) + np.random.normal(0, 100, num_samples)
    position_y = np.random.normal(0, 500, num_samples)
    position_z = np.random.normal(0, 500, num_samples)

    # Velocities (km/s)
    velocity_x = -np.random.uniform(1, 5, num_samples)  # Approaching
    velocity_y = np.random.normal(0, 0.5, num_samples)
    velocity_z = np.random.normal(0, 0.5, num_samples)

    # Acceleration (m/s²)
    acceleration = np.random.normal(0, 0.1, num_samples)

    # Fuel level (0-100%)
    fuel_level = np.maximum(0, 100 - np.linspace(0, 50, num_samples) + np.random.normal(0, 5, num_samples))

    # Asteroid distance (km)
    asteroid_distance = np.random.exponential(1000, num_samples)

    # Hazard score (0-10)
    hazard_score = np.random.beta(2, 5, num_samples) * 10

    # Landing zone coords (lat, lon on Mars)
    landing_zone_lat = np.random.uniform(-90, 90, num_samples)
    landing_zone_lon = np.random.uniform(-180, 180, num_samples)

    data = {
        'timestamp': timestamps,
        'position_x': position_x,
        'position_y': position_y,
        'position_z': position_z,
        'velocity_x': velocity_x,
        'velocity_y': velocity_y,
        'velocity_z': velocity_z,
        'acceleration': acceleration,
        'fuel_level': fuel_level,
        'asteroid_distance': asteroid_distance,
        'hazard_score': hazard_score,
        'landing_zone_lat': landing_zone_lat,
        'landing_zone_lon': landing_zone_lon
    }

    return pd.DataFrame(data)

def inject_fake_data(df, corruption_rate=0.1):
    """Inject corrupted, anomalous, or adversarial data for testing.

    Args:
        df: Original DataFrame.
        corruption_rate: Fraction of data to corrupt.

    Returns:
        DataFrame with injected fake data.
    """
    df_copy = df.copy()
    num_corrupt = int(len(df) * corruption_rate)
    corrupt_indices = np.random.choice(len(df), num_corrupt, replace=False)

    # Corrupt positions with extreme values
    df_copy.loc[corrupt_indices, 'position_x'] *= np.random.choice([-10, 10], num_corrupt)
    df_copy.loc[corrupt_indices, 'velocity_x'] *= np.random.uniform(5, 20, num_corrupt)

    # Fake fuel levels
    df_copy.loc[corrupt_indices, 'fuel_level'] = np.random.uniform(0, 200, num_corrupt)

    # Anomalous hazard scores
    df_copy.loc[corrupt_indices, 'hazard_score'] = np.random.uniform(8, 15, num_corrupt)

    return df_copy

def save_to_csv(df, filename):
    """Save DataFrame to CSV.

    Args:
        df: DataFrame to save.
        filename: Output filename.
    """
    df.to_csv(filename, index=False)
    print(f"Data saved to {filename}")