// Face Authentication Utility
// Uses browser's MediaDevices API for camera access

export class FaceAuth {
  constructor() {
    this.videoElement = null;
    this.canvasElement = null;
    this.stream = null;
  }

  // Initialize camera stream
  async initCamera(videoElement) {
    try {
      this.videoElement = videoElement;
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      this.videoElement.srcObject = this.stream;
      return true;
    } catch (error) {
      console.error('Camera access denied:', error);
      return false;
    }
  }

  // Capture face image from video
  captureFace(canvasElement) {
    if (!this.videoElement || !canvasElement) return null;
    
    this.canvasElement = canvasElement;
    const context = canvasElement.getContext('2d');
    canvasElement.width = this.videoElement.videoWidth;
    canvasElement.height = this.videoElement.videoHeight;
    
    context.drawImage(this.videoElement, 0, 0);
    return canvasElement.toDataURL('image/jpeg', 0.8);
  }

  // Stop camera stream
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Save user face data to localStorage (JSON)
  async registerUser(username, faceData) {
    try {
      const users = this.getUsers();
      
      // Check if user already exists
      if (users[username]) {
        return { success: false, message: 'User already exists' };
      }

      // Save user with face data
      users[username] = {
        username,
        faceData,
        registeredAt: new Date().toISOString()
      };

      localStorage.setItem('galacti_users', JSON.stringify(users));
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed' };
    }
  }

  // Authenticate user with face data
  async authenticateUser(faceData) {
    try {
      const users = this.getUsers();
      
      // Simple comparison (in production, use ML face recognition)
      for (const [username, userData] of Object.entries(users)) {
        // Simple similarity check (placeholder for real face recognition)
        if (this.compareFaces(userData.faceData, faceData)) {
          localStorage.setItem('galacti_current_user', username);
          return { success: true, username, message: 'Authentication successful' };
        }
      }

      return { success: false, message: 'Face not recognized' };
    } catch (error) {
      console.error('Authentication error:', error);
      return { success: false, message: 'Authentication failed' };
    }
  }

  // Get all registered users
  getUsers() {
    try {
      const users = localStorage.getItem('galacti_users');
      return users ? JSON.parse(users) : {};
    } catch (error) {
      console.error('Error reading users:', error);
      return {};
    }
  }

  // Get current logged-in user
  getCurrentUser() {
    return localStorage.getItem('galacti_current_user');
  }

  // Logout current user
  logout() {
    localStorage.removeItem('galacti_current_user');
  }

  // Simple face comparison (placeholder - in production use ML)
  compareFaces(face1, face2) {
    // This is a simple placeholder comparison
    // In production, integrate with TensorFlow.js face-api or similar
    if (!face1 || !face2) return false;
    
    // For demo purposes, we'll do a simple string comparison
    // In real app, use proper face recognition algorithms
    const similarity = this.calculateImageSimilarity(face1, face2);
    return similarity > 0.85; // 85% similarity threshold
  }

  // Calculate basic image similarity (placeholder)
  calculateImageSimilarity(img1, img2) {
    // This is a very basic placeholder
    // Real implementation would use face embeddings comparison
    if (img1 === img2) return 1.0;
    
    // For demo, check if images have similar length (very basic)
    const lengthRatio = Math.min(img1.length, img2.length) / Math.max(img1.length, img2.length);
    return lengthRatio * 0.9; // Simplified similarity
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getCurrentUser();
  }
}

export default new FaceAuth();
