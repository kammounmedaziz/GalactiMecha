"""SLM module for interpreting textual mission instructions."""

import numpy as np
import re

class SLMInterpreter:
    """Small Language Model interpreter for mission instructions."""

    def __init__(self):
        # Simple rule-based fallback when transformers isn't available
        self.use_transformers = False
        try:
            from transformers import pipeline
            self.model = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")
            self.use_transformers = True
            print("✅ SLM: Using DistilBERT model")
        except Exception as e:
            print(f"⚠️ SLM: Transformers not available ({e}), using rule-based fallback")
            self.use_transformers = False

    def interpret_instruction(self, instruction):
        """Interpret textual instruction and convert to guidance vector.

        Args:
            instruction: Text instruction (e.g., "Approach Mars from north trajectory with minimal fuel use")

        Returns:
            Guidance vector (numeric representation).
        """
        if self.use_transformers:
            # Use actual model
            result = self.model(instruction)[0]
            label = result['label']
            score = result['score']

            # Map to guidance: positive -> north approach, negative -> south, score -> fuel priority
            if label == 'POSITIVE':
                guidance = np.array([1.0, 0.0, score])  # North, minimal fuel
            else:
                guidance = np.array([-1.0, 0.0, score])  # South, adjust fuel
        else:
            # Rule-based fallback
            instruction_lower = instruction.lower()

            # Direction detection
            if 'north' in instruction_lower:
                direction = 1.0
            elif 'south' in instruction_lower:
                direction = -1.0
            else:
                direction = 0.0

            # Fuel priority detection
            if 'minimal' in instruction_lower or 'conserv' in instruction_lower or 'save' in instruction_lower:
                fuel_priority = 0.8
            elif 'aggressive' in instruction_lower or 'fast' in instruction_lower or 'quick' in instruction_lower:
                fuel_priority = 0.2
            else:
                fuel_priority = 0.5

            guidance = np.array([direction, 0.0, fuel_priority])

        return guidance

# Global instance
slm = SLMInterpreter()