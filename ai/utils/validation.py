"""Input/output sanity checks for GalactiMecha."""

def validate_input(input_data):
    """Validate input data.

    Args:
        input_data: Input to validate.

    Returns:
        True if valid, raises ValueError otherwise.
    """
    if not input_data:
        raise ValueError("Input data cannot be empty.")
    # TODO: Add more validation rules
    return True

def validate_output(output_data):
    """Validate output data.

    Args:
        output_data: Output to validate.

    Returns:
        True if valid, raises ValueError otherwise.
    """
    if "prediction" not in output_data:
        raise ValueError("Output must contain 'prediction' key.")
    # TODO: Add more validation
    return True