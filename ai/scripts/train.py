"""Training scripts with logging for GalactiMecha."""

import logging
from model import BaseModel
from data_pipeline import load_data, clean_data, normalize_data

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def train_model():
    """Train the model with logging."""
    logging.info("Starting training process.")

    # Load and preprocess data
    raw_data = load_data("path/to/data")
    cleaned_data = clean_data(raw_data)
    normalized_data = normalize_data(cleaned_data)

    # Initialize and train model
    model = BaseModel()
    model.train(normalized_data, epochs=10)

    logging.info("Training completed.")
    return model

if __name__ == "__main__":
    train_model()