"""Core navigation AI model for GalactiMecha."""

import torch
import torch.nn as nn
import numpy as np

class NavigationModel(nn.Module):
    """Neural network for spacecraft navigation."""

    def __init__(self, input_size=13, hidden_size=64, output_size=6):
        super(NavigationModel, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, output_size)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.fc3(x)
        return x

def train_model(data, epochs=10):
    """Train the navigation model.

    Args:
        data: Training data (pandas DataFrame).
    """
    model = NavigationModel()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()

    # Prepare data: input is sensor data + dummy guidance, target is dummy (e.g., zero thrust for simplicity)
    sensor_data = data.drop(['timestamp', 'landing_zone_lat', 'landing_zone_lon'], axis=1).values  # 10 features
    dummy_guidance = np.zeros((len(sensor_data), 3))  # Dummy guidance
    inputs_data = np.concatenate([sensor_data, dummy_guidance], axis=1)  # 13 features
    targets = np.zeros((len(sensor_data), 6))  # Dummy targets: no thrust

    dataset = torch.utils.data.TensorDataset(torch.tensor(inputs_data, dtype=torch.float32), torch.tensor(targets, dtype=torch.float32))
    dataloader = torch.utils.data.DataLoader(dataset, batch_size=32, shuffle=True)

    for epoch in range(epochs):
        epoch_loss = 0
        for inputs, targets_batch in dataloader:
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets_batch)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()
        print(f"Epoch {epoch+1}/{epochs}, Loss: {epoch_loss / len(dataloader):.4f}")

    # Save model
    torch.save(model.state_dict(), 'navigation_model.pth')
    print("Model trained and saved.")

def predict_next_move(current_state, guidance_vector):
    """Predict next navigation move.

    Args:
        current_state: Current sensor data (numpy array).
        guidance_vector: Guidance from SLM (numpy array).

    Returns:
        Thrust vector and orientation adjustment (numpy array).
    """
    import os
    
    model = NavigationModel()
    
    # Find the model file in the project root or models directory
    model_path = None
    possible_paths = [
        'navigation_model.pth',  # Current directory
        '../navigation_model.pth',  # Parent directory
        '../../navigation_model.pth',  # Project root
        os.path.join(os.path.dirname(__file__), '..', '..', 'navigation_model.pth'),  # Absolute path to project root
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            model_path = path
            break
    
    if model_path and os.path.exists(model_path):
        try:
            model.load_state_dict(torch.load(model_path))
            model.eval()
        except Exception as e:
            print(f"Warning: Could not load model from {model_path}: {e}")
            print("Using untrained model for predictions.")
    else:
        print("Warning: navigation_model.pth not found. Using untrained model for predictions.")

    # Combine state and guidance
    input_data = np.concatenate([current_state, guidance_vector])
    input_data = input_data.astype(np.float32)  # Ensure float32
    input_tensor = torch.tensor(input_data, dtype=torch.float32).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor).squeeze(0).numpy()

    # Output: thrust_x, thrust_y, thrust_z, orient_x, orient_y, orient_z
    return output