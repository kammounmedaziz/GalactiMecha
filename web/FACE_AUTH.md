# GalactiMecha Face Authentication System

This system uses Face ID authentication with JSON-based user storage in the browser's localStorage.

## Features

- 📸 **Face ID Registration**: Capture and store face data for authentication
- 🔐 **Secure Login**: Authenticate using facial recognition
- 💾 **JSON Storage**: User data stored in browser localStorage
- 🎨 **Interstellar UI**: Beautiful space-themed interface
- 📊 **AI Dashboard**: View mission control statistics

## How It Works

### Registration Flow
1. Navigate to `/register`
2. Enter your username
3. Click "Activate Camera" to start webcam
4. Position your face in the frame
5. Click "Capture Face" to take a photo
6. Click "Complete Registration" to save

### Login Flow
1. Navigate to `/login`
2. Click "Start Face Authentication"
3. Position your face in the frame
4. Click "Authenticate Now"
5. System compares your face with stored data
6. Access granted if match found

### Dashboard
- View AI navigation statistics
- Monitor system performance
- Check recent activity
- Quick access to AI functions

## User Data Storage

User data is stored in `localStorage` with the key `galacti_users`:

```json
{
  "username": {
    "username": "astronaut1",
    "faceData": "base64_encoded_image_data",
    "registeredAt": "2025-11-08T18:00:00.000Z"
  }
}
```

Current logged-in user is stored in `galacti_current_user`.

## Technical Details

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS with custom Interstellar theme
- **Camera**: Browser MediaDevices API
- **Storage**: localStorage (JSON format)
- **Face Recognition**: Simplified comparison (can be enhanced with TensorFlow.js)

## Security Notes

⚠️ **Development Mode**: This implementation uses basic face comparison for demonstration purposes.

For production use, consider:
- Implement proper face recognition using TensorFlow.js or face-api.js
- Add encryption for stored face data
- Use backend authentication with JWT tokens
- Implement rate limiting and security headers
- Add biometric anti-spoofing measures

## Browser Compatibility

Requires modern browser with:
- MediaDevices API support
- Canvas API
- localStorage
- ES6+ JavaScript

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Open browser at `http://localhost:5174`

3. Register a new account with Face ID

4. Login using your face

5. Access the Mission Control dashboard

## API Integration

The dashboard connects to the Python AI backend at `http://localhost:5000`:

- Navigation predictions
- Anomaly detection
- Mission simulations
- Attack scenario analysis

Make sure the Express API server is running for full functionality.
