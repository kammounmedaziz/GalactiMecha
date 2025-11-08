"""Base model definitions for GalactiMecha."""

class BaseModel:
    """Base AI model class for GalactiMecha.

    Subclasses should implement the `predict` method.
    """

    def __init__(self):
        # Minimal init; real models will add weights, config, etc.
        pass

    def predict(self, input_data):
        """Stub predict method.

        Args:
            input_data: input for the model

        Returns:
            A prediction result or raises NotImplementedError for now.
        """
        raise NotImplementedError("predict must be implemented by subclasses of BaseModel")
