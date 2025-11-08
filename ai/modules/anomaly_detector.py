"""Anomaly detector for GalactiMecha."""

import numpy as np
from sklearn.ensemble import IsolationForest

class AnomalyDetector:
    """Detects anomalies in telemetry data."""

    def __init__(self):
        self.model = IsolationForest(contamination=0.1, random_state=42)

    def fit(self, data):
        """Fit the detector on normal data.

        Args:
            data: Normal data (numpy array).
        """
        self.model.fit(data)

    def detect(self, data_point):
        """Detect if data point is anomalous.

        Args:
            data_point: Single data point (numpy array).

        Returns:
            -1 if anomaly, 1 if normal.
        """
        return self.model.predict(data_point.reshape(1, -1))[0]

    def decision_function(self, data_point):
        """Get anomaly score for data point.

        Args:
            data_point: Single data point or array of data points.

        Returns:
            Anomaly score (more negative = more anomalous).
        """
        return self.model.decision_function(data_point)

    def score_samples(self, data_point):
        """Get anomaly score for data point (alternative method).

        Args:
            data_point: Single data point or array of data points.

        Returns:
            Anomaly score.
        """
        return self.model.score_samples(data_point)

def statistical_check(data_point, reference_stats):
    """Simple statistical check for anomalies.

    Args:
        data_point: Data point.
        reference_stats: Dict with mean and std for each feature.

    Returns:
        True if anomalous.
    """
    for i, value in enumerate(data_point):
        mean = reference_stats['mean'][i]
        std = reference_stats['std'][i]
        if abs(value - mean) > 3 * std:  # 3-sigma rule
            return True
    return False