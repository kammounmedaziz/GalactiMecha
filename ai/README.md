# GalactiMecha AI Module
This module provides AI capabilities for safe spacecraft navigation during Mars missions, including telemetry processing, SLM-based instruction interpretation, anomaly detection, and simulation.
## Features
- **Data Generation**: Simulate Mars mission telemetry with normal and anomalous data.
- **SLM Integration**: Interpret textual instructions using a small language model.
- **Navigation AI**: Predict thrust and orientation adjustments.
- **Anomaly Detection**: Detect corrupted or fake data.
- **Training & Inference**: Scripts for model training and simulation.
- **Gradio Interface**: Interactive UI for testing.
## Installation
Ensure Python 3.10+ and install dependencies:
```bash
pip install -r ../../requirements.txt
```
## Usage
### Generate Data
```python
from data.data_generator import generate_correct_data, inject_fake_data, save_to_csv
data = generate_correct_data(1000)
anomalous_data = inject_fake_data(data, corruption_rate=0.1)
save_to_csv(anomalous_data, 'mars_telemetry.csv')
```
### Train Model
```bash
python scripts/training.py
```
### Run Simulation
```python
python scripts/inference.py
```
For interactive simulation:
```bash
python scripts/gradio_interface.py
```
Then open the Gradio URL in your browser.
## Structure
- `data/`: Data generation and processing (`data_generator.py`, `data_pipeline.py`)
- `models/`: AI models (`navigation.py`, `model.py`)
- `modules/`: Specialized modules (`slm_module.py`, `anomaly_detector.py`)
- `scripts/`: Executable scripts (`training.py`, `inference.py`, `gradio_interface.py`, etc.)
- `utils/`: Utility functions (`utils.py`, `validation.py`, `drift.py`)
- `experiments/`: Experiment scripts and poisoning tools
## Modules
## Future Extensions
- Integrate reinforcement learning for better navigation.
- Connect to backend API for real-time data.
- Add visualization dashboards.
