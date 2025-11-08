"""Run experiments and log results."""

import logging
from model import BaseModel
from poisoner import poison_data

logging.basicConfig(level=logging.INFO)

def run_experiment(clean_data, poisoned_data):
    """Run experiment comparing clean vs poisoned training.

    Args:
        clean_data: Clean training data.
        poisoned_data: Poisoned training data.
    """
    logging.info("Running experiment.")

    # Train on clean
    model_clean = BaseModel()
    model_clean.train(clean_data)

    # Train on poisoned
    model_poisoned = BaseModel()
    model_poisoned.train(poisoned_data)

    # Log results
    logging.info("Experiment completed.")
    return {"clean_accuracy": 0.95, "poisoned_accuracy": 0.85}  # Stub

if __name__ == "__main__":
    # Stub data
    clean = []
    poisoned = poison_data(clean)
    results = run_experiment(clean, poisoned)
    print(results)