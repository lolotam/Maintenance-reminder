require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  // Allow requests from any origin in development
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for large data uploads

// MongoDB Connection URI from .env
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("FATAL ERROR: MongoDB URI is not defined in environment variables");
  process.exit(1);
}

let client;
let db;

// Connect to MongoDB with better error handling and retry logic
async function connectToMongo() {
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    
    client = new MongoClient(uri, {
      // Added options to improve connection reliability
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
    
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas");
    
    db = client.db("maintenance_app");
    
    // Create collections if they don't exist
    if (!await db.listCollections({ name: 'ppm_machines' }).hasNext()) {
      await db.createCollection('ppm_machines');
      console.log("Created ppm_machines collection");
    }
    
    if (!await db.listCollections({ name: 'ocm_machines' }).hasNext()) {
      await db.createCollection('ocm_machines');
      console.log("Created ocm_machines collection");
    }

    return db;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    return null;
  }
}

// API Routes - add better error handling
app.get('/api/machines/ppm', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database connection not established" });
    }
    const ppmMachines = await db.collection('ppm_machines').find({}).toArray();
    console.log(`Retrieved ${ppmMachines.length} PPM machines`);
    res.json(ppmMachines);
  } catch (error) {
    console.error("Error fetching PPM machines:", error);
    res.status(500).json({ error: "Failed to fetch PPM machines: " + error.message });
  }
});

app.get('/api/machines/ocm', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database connection not established" });
    }
    const ocmMachines = await db.collection('ocm_machines').find({}).toArray();
    res.json(ocmMachines);
  } catch (error) {
    console.error("Error fetching OCM machines:", error);
    res.status(500).json({ error: "Failed to fetch OCM machines" });
  }
});

app.post('/api/machines/ppm', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database connection not established" });
    }
    const result = await db.collection('ppm_machines').insertOne(req.body);
    res.status(201).json({ id: result.insertedId, ...req.body });
  } catch (error) {
    console.error("Error adding PPM machine:", error);
    res.status(500).json({ error: "Failed to add PPM machine" });
  }
});

app.post('/api/machines/ocm', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database connection not established" });
    }
    const result = await db.collection('ocm_machines').insertOne(req.body);
    res.status(201).json({ id: result.insertedId, ...req.body });
  } catch (error) {
    console.error("Error adding OCM machine:", error);
    res.status(500).json({ error: "Failed to add OCM machine" });
  }
});

app.post('/api/machines/ppm/bulk', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database connection not established" });
    }
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Invalid data format. Expected non-empty array." });
    }
    
    console.log(`Received bulk upload request for ${req.body.length} PPM machines`);
    const result = await db.collection('ppm_machines').insertMany(req.body);
    console.log(`Successfully inserted ${result.insertedCount} PPM machines`);
    res.status(201).json({ insertedCount: result.insertedCount });
  } catch (error) {
    console.error("Error adding PPM machines in bulk:", error);
    res.status(500).json({ error: "Failed to add PPM machines: " + error.message });
  }
});

app.post('/api/machines/ocm/bulk', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database connection not established" });
    }
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "Invalid data format. Expected non-empty array." });
    }
    
    console.log(`Received bulk upload request for ${req.body.length} OCM machines`);
    const result = await db.collection('ocm_machines').insertMany(req.body);
    console.log(`Successfully inserted ${result.insertedCount} OCM machines`);
    res.status(201).json({ insertedCount: result.insertedCount });
  } catch (error) {
    console.error("Error adding OCM machines in bulk:", error);
    res.status(500).json({ error: "Failed to add OCM machines: " + error.message });
  }
});

app.delete('/api/machines/ppm/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database connection not established" });
    }
    const { id } = req.params;
    // Try to delete by MongoDB ObjectId first
    let result;
    try {
      result = await db.collection('ppm_machines').deleteOne({ _id: new ObjectId(id) });
    } catch (e) {
      // If error (likely invalid ObjectId format), try with string id
      result = await db.collection('ppm_machines').deleteOne({ id: id });
    }
    res.json({ deleted: result.deletedCount > 0 });
  } catch (error) {
    console.error("Error deleting PPM machine:", error);
    res.status(500).json({ error: "Failed to delete PPM machine" });
  }
});

app.delete('/api/machines/ocm/:id', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Database connection not established" });
    }
    const { id } = req.params;
    // Try to delete by MongoDB ObjectId first
    let result;
    try {
      result = await db.collection('ocm_machines').deleteOne({ _id: new ObjectId(id) });
    } catch (e) {
      // If error (likely invalid ObjectId format), try with string id
      result = await db.collection('ocm_machines').deleteOne({ id: id });
    }
    res.json({ deleted: result.deletedCount > 0 });
  } catch (error) {
    console.error("Error deleting OCM machine:", error);
    res.status(500).json({ error: "Failed to delete OCM machine" });
  }
});

// Add a simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start server with connection retry logic
(async function startServer() {
  console.log("Starting server...");
  
  let connected = false;
  let attempts = 0;
  const maxAttempts = 5;
  
  while (!connected && attempts < maxAttempts) {
    attempts++;
    console.log(`Connection attempt ${attempts}/${maxAttempts}`);
    
    db = await connectToMongo();
    
    if (db) {
      connected = true;
    } else {
      console.log("Will retry connecting in 5 seconds...");
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  if (!connected) {
    console.error("Failed to connect to MongoDB after multiple attempts. Server will start but database operations will fail.");
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
})();

// Handle server shutdown
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});
