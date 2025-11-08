"""Training script for GalactiMecha navigation AI."""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from ai.data.data_generator import generate_correct_data
from ai.models.navigation import train_model

def main():
    """Main training function."""
    print("Generating training data...")
    data = generate_correct_data(1000)

    print("Training navigation model...")
    train_model(data, epochs=20)

    print("Training complete.")

if __name__ == "__main__":
    main()