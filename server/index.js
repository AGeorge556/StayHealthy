const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 8181;
const fs = require('fs');

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Middleware
app.use(express.json());

// Initialize MongoDB connection flag
let isDbConnected = false;

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
  // Create a basic index.html file
  fs.writeFileSync(
    path.join(buildDir, 'index.html'),
    '<html><body><h1>StayHealthy API Server</h1><p>Server is running.</p></body></html>'
  );
}

// Connect to MongoDB
(async () => {
  try {
    isDbConnected = await connectToMongo();
    console.log(`Server starting with MongoDB connection: ${isDbConnected ? 'CONNECTED' : 'OFFLINE MODE'}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    isDbConnected = false;
    console.log('Server starting in OFFLINE MODE');
  }
})();

// Routes
app.use('/api/auth', require('./routes/auth'));

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    dbConnected: isDbConnected,
    serverTime: new Date().toISOString()
  });
});

// Send index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Root handler
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'StayHealthy API Server',
    mode: isDbConnected ? 'connected' : 'offline'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    offline: !isDbConnected
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});