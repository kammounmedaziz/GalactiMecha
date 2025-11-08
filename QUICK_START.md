# 🚀 Quick Start Guide - GalactiMecha

## ✅ What's Completed

### Frontend (React + Vite)
✅ Interstellar-themed landing page with animated starfield
✅ Face ID registration system with webcam capture
✅ Face recognition login system  
✅ Mission Control Dashboard with:
  - Real-time AI stats (accuracy, response time, simulations)
  - Navigation simulation with 3D trajectory plots
  - Attack scenario testing with defense analysis
  - Performance analytics dashboard
  - Interactive Plotly charts
✅ Glass morphism UI with neon effects
✅ Fully responsive design

### Authentication
✅ Face capture and storage (localStorage JSON)
✅ Face comparison for login
✅ Session management
✅ Protected routes

### AI Integration
✅ Connected to Gradio API (port 7860)
✅ Multi-step navigation simulations
✅ Anomaly detection with customizable parameters
✅ Attack defense testing
✅ Analytics testing
✅ Real-time chart visualization

## 🎯 How to Use

### 1. Start All Services

```bash
# Terminal 1: AI System
cd ai
python scripts/run_interface.py

# Terminal 2: Frontend (already running)
# http://localhost:5175
```

### 2. Register Your Account

1. Open http://localhost:5175
2. Click "Start Mission"
3. Click "Register New Account"
4. Enter username
5. Activate camera and capture face
6. Complete registration

### 3. Login with Face ID

1. Go to login page
2. Click "Start Face Authentication"
3. Position face in camera
4. Click "Authenticate Now"
5. Access Dashboard

### 4. Run Simulations

**Navigation Simulation:**
- Go to "Simulation" tab
- Adjust parameters (steps, anomaly rate, sensitivity)
- Click "Run Simulation"
- View 3D trajectory and sensor data

**Attack Scenarios:**
- Go to "Attack Scenarios" tab
- Set attack parameters (start time, duration)
- Click "Run Attack Scenario"
- View defense analysis and deviations

**Analytics:**
- Go to "Analytics" tab
- Click "Run Analytics Test"
- View performance comparison

## 📊 Dashboard Features

### Overview Tab
- System status indicators
- Quick action buttons
- Real-time metrics

### Simulation Tab
- Mission instruction input
- Parameter sliders (steps, anomaly rate, sensitivity)
- 3D trajectory visualization
- Sensor data charts
- Step-by-step results table

### Attack Scenario Tab
- Attack timing controls
- Baseline vs attacked comparison
- Detection timeline
- Sensor deviation analysis

### Analytics Tab
- Performance testing
- Approach comparison
- Detailed reports

## 🎨 UI Theme

**Colors:**
- Deep space blacks (#0a0e27)
- Cyan accents (#64b5f6)
- Nebula purples (#6a0dad)
- Galaxy blues (#4b0082)

**Effects:**
- Glass morphism backgrounds
- Neon text glow
- Smooth animations
- Floating orbs
- Twinkling stars

## 🔧 Configuration

### API Endpoints
- **AI API**: http://127.0.0.1:7860
- **Express API**: http://localhost:5000 (optional)
- **Frontend**: http://localhost:5175

### User Data Storage
Users are stored in `localStorage` as JSON:
```json
{
  "username": {
    "username": "astronaut1",
    "faceData": "base64_image",
    "registeredAt": "2025-11-08T..."
  }
}
```

## ⚡ Features in Action

### Face Authentication
- Real-time camera feed
- Face capture with preview
- Instant authentication
- Session persistence

### AI Simulations
- Customizable parameters
- Real-time processing
- Interactive 3D plots
- Detailed step analysis

### Attack Testing
- Baseline comparison
- Attack injection
- Detection metrics
- Response analysis

## 🎯 Next Steps

1. **Test the System:**
   - Register with your face
   - Run a navigation simulation
   - Test attack scenario
   - View analytics

2. **Customize:**
   - Modify colors in `tailwind.config.js`
   - Adjust AI parameters
   - Add custom instructions

3. **Extend:**
   - Add more AI endpoints
   - Create custom visualizations
   - Implement team features
   - Add mission history

## 📱 Quick Navigation

- **Home**: `/` - Landing page
- **Register**: `/register` - Create account
- **Login**: `/login` - Face authentication
- **Dashboard**: `/dashboard` - Mission control

## 🔒 Security Notes

**Current State**: Development mode with basic face comparison

**For Production:**
- Implement TensorFlow.js face recognition
- Add encryption for face data
- Use backend authentication (JWT)
- Implement rate limiting
- Add anti-spoofing measures

## 🐛 Common Issues

**Camera not working?**
- Allow browser camera permissions
- Use HTTPS or localhost

**AI API not responding?**
- Check if Gradio is running on port 7860
- Verify Python script is active

**Charts not showing?**
- Check browser console
- Verify Plotly.js is installed
- Ensure AI returns valid data

**Face not recognized?**
- Use consistent lighting
- Position face clearly
- Re-register if needed

## 🎉 You're All Set!

Your GalactiMecha system is fully operational:
✅ Face ID authentication working
✅ AI integration complete
✅ Dashboard with charts ready
✅ All visualizations functional

**Navigate the cosmic void with confidence!** 🌌🚀
