"""Drift detection and anomaly detection for GalactiMecha."""

import numpy as np
from scipy import stats
import pandas as pd

def detect_drift(current_data, reference_data, method='psi', threshold=0.1):
    """Detect data drift between current and reference distributions.

    Args:
        current_data: Current data distribution (numpy array or pandas DataFrame)
        reference_data: Reference data distribution (numpy array or pandas DataFrame)
        method: Drift detection method ('psi', 'ks', 'js')
        threshold: Threshold for drift detection

    Returns:
        Dict with drift detection results
    """
    try:
        # Convert to numpy arrays if needed
        if isinstance(current_data, pd.DataFrame):
            current_data = current_data.values
        if isinstance(reference_data, pd.DataFrame):
            reference_data = reference_data.values

        current_data = np.array(current_data).flatten()
        reference_data = np.array(reference_data).flatten()

        # Remove NaN and infinite values
        current_data = current_data[np.isfinite(current_data)]
        reference_data = reference_data[np.isfinite(reference_data)]

        if len(current_data) == 0 or len(reference_data) == 0:
            return {
                "drift_detected": False,
                "score": 0.0,
                "method": method,
                "error": "Empty data arrays"
            }

        if method == 'psi':
            # Population Stability Index
            score = calculate_psi(current_data, reference_data)
            drift_detected = score > threshold

        elif method == 'ks':
            # Kolmogorov-Smirnov test
            try:
                ks_stat, p_value = stats.ks_2samp(current_data, reference_data)
                score = ks_stat
                drift_detected = p_value < 0.05  # Statistical significance
            except Exception as e:
                return {
                    "drift_detected": False,
                    "score": 0.0,
                    "method": method,
                    "error": f"KS test failed: {str(e)}"
                }

        elif method == 'js':
            # Jensen-Shannon divergence
            score = calculate_js_divergence(current_data, reference_data)
            drift_detected = score > threshold

        else:
            return {
                "drift_detected": False,
                "score": 0.0,
                "method": method,
                "error": f"Unknown method: {method}"
            }

        return {
            "drift_detected": drift_detected,
            "score": float(score),
            "method": method,
            "threshold": threshold,
            "current_samples": len(current_data),
            "reference_samples": len(reference_data)
        }

    except Exception as e:
        return {
            "drift_detected": False,
            "score": 0.0,
            "method": method,
            "error": str(e)
        }

def calculate_psi(current_data, reference_data, bins=10):
    """Calculate Population Stability Index (PSI).

    Args:
        current_data: Current distribution
        reference_data: Reference distribution
        bins: Number of bins for histogram

    Returns:
        PSI score (float)
    """
    try:
        # Create histograms
        ref_hist, bin_edges = np.histogram(reference_data, bins=bins, density=True)
        curr_hist, _ = np.histogram(current_data, bins=bin_edges, density=True)

        # Avoid division by zero
        ref_hist = ref_hist + 1e-6
        curr_hist = curr_hist + 1e-6

        # Calculate PSI
        psi = np.sum((curr_hist - ref_hist) * np.log(curr_hist / ref_hist))

        return float(psi)

    except Exception as e:
        print(f"PSI calculation error: {e}")
        return 0.0

def calculate_js_divergence(current_data, reference_data, bins=10):
    """Calculate Jensen-Shannon divergence.

    Args:
        current_data: Current distribution
        reference_data: Reference distribution
        bins: Number of bins for histogram

    Returns:
        JS divergence score (float)
    """
    try:
        # Create histograms
        ref_hist, bin_edges = np.histogram(reference_data, bins=bins, density=True)
        curr_hist, _ = np.histogram(current_data, bins=bin_edges, density=True)

        # Normalize to probability distributions
        ref_hist = ref_hist / np.sum(ref_hist)
        curr_hist = curr_hist / np.sum(curr_hist)

        # Calculate midpoint distribution
        midpoint = (ref_hist + curr_hist) / 2

        # Calculate KL divergences
        kl_ref = np.sum(ref_hist * np.log((ref_hist + 1e-10) / (midpoint + 1e-10)))
        kl_curr = np.sum(curr_hist * np.log((curr_hist + 1e-10) / (midpoint + 1e-10)))

        # Jensen-Shannon divergence
        js_div = (kl_ref + kl_curr) / 2

        return float(js_div)

    except Exception as e:
        print(f"JS divergence calculation error: {e}")
        return 0.0

def detect_anomaly(data_point, model, threshold=0.5):
    """Detect anomalies in individual data points.

    Args:
        data_point: Single data point or array of data points
        model: Trained anomaly detection model (e.g., IsolationForest)
        threshold: Anomaly threshold

    Returns:
        Dict with anomaly detection results
    """
    try:
        if hasattr(model, 'predict'):
            # For scikit-learn style models
            prediction = model.predict([data_point])
            is_anomaly = prediction[0] == -1

            if hasattr(model, 'decision_function'):
                score = model.decision_function([data_point])[0]
            elif hasattr(model, 'score_samples'):
                score = -model.score_samples([data_point])[0]  # Convert to anomaly score
            else:
                score = 0.0

        else:
            # Fallback statistical method
            is_anomaly = False
            score = 0.0

        return {
            "is_anomaly": bool(is_anomaly),
            "score": float(score),
            "threshold": threshold,
            "method": "model_based" if hasattr(model, 'predict') else "statistical"
        }

    except Exception as e:
        return {
            "is_anomaly": False,
            "score": 0.0,
            "threshold": threshold,
            "error": str(e)
        }

def monitor_model_performance(predictions, actual_outcomes, reference_metrics=None):
    """Monitor model performance drift over time.

    Args:
        predictions: Model predictions
        actual_outcomes: Actual outcomes
        reference_metrics: Reference performance metrics

    Returns:
        Dict with performance monitoring results
    """
    try:
        predictions = np.array(predictions)
        actual_outcomes = np.array(actual_outcomes)

        # Calculate current metrics
        if len(np.unique(actual_outcomes)) > 1:
            from sklearn.metrics import accuracy_score, precision_score, recall_score

            accuracy = accuracy_score(actual_outcomes, predictions)
            precision = precision_score(actual_outcomes, predictions, average='weighted', zero_division=0)
            recall = recall_score(actual_outcomes, predictions, average='weighted', zero_division=0)
        else:
            accuracy = precision = recall = 0.0

        current_metrics = {
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall
        }

        # Compare with reference metrics
        performance_drift = False
        if reference_metrics:
            for metric, ref_value in reference_metrics.items():
                if metric in current_metrics:
                    diff = abs(current_metrics[metric] - ref_value)
                    if diff > 0.1:  # 10% degradation threshold
                        performance_drift = True
                        break

        return {
            "current_metrics": current_metrics,
            "performance_drift": performance_drift,
            "reference_comparison": reference_metrics is not None,
            "samples": len(predictions)
        }

    except Exception as e:
        return {
            "current_metrics": {},
            "performance_drift": False,
            "error": str(e)
        }