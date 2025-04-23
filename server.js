
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri = process.env.MONGO_URI || "mongodb+srv://lolotam:<password>@cluster1000.4zvov8d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1000";
// Important: Replace <password> with your actual password in a .env file, not in code

let client;
let db;

// Connect to MongoDB
async function connectToMongo() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("maintenance_app");
    console.log("Connected to MongoDB Atlas");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// API Routes
app.get('/api/machines/ppm', async (req, res) => {
  try {
    const ppmMachines = await db.collection('ppm_machines').find({}).toArray();
    res.json(ppmMachines);
  } catch (error) {
    console.error("Error fetching PPM machines:", error);
    res.status(500).json({ error: "Failed to fetch PPM machines" });
  }
});

app.get('/api/machines/ocm', async (req, res) => {
  try {
    const ocmMachines = await db.collection('ocm_machines').find({}).toArray();
    res.json(ocmMachines);
  } catch (error) {
    console.error("Error fetching OCM machines:", error);
    res.status(500).json({ error: "Failed to fetch OCM machines" });
  }
});

app.post('/api/machines/ppm', async (req, res) => {
  try {
    const result = await db.collection('ppm_machines').insertOne(req.body);
    res.status(201).json({ id: result.insertedId, ...req.body });
  } catch (error) {
    console.error("Error adding PPM machine:", error);
    res.status(500).json({ error: "Failed to add PPM machine" });
  }
});

app.post('/api/machines/ocm', async (req, res) => {
  try {
    const result = await db.collection('ocm_machines').insertOne(req.body);
    res.status(201).json({ id: result.insertedId, ...req.body });
  } catch (error) {
    console.error("Error adding OCM machine:", error);
    res.status(500).json({ error: "Failed to add OCM machine" });
  }
});

app.post('/api/machines/ppm/bulk', async (req, res) => {
  try {
    const result = await db.collection('ppm_machines').insertMany(req.body);
    res.status(201).json({ insertedCount: result.insertedCount });
  } catch (error) {
    console.error("Error adding PPM machines in bulk:", error);
    res.status(500).json({ error: "Failed to add PPM machines" });
  }
});

app.post('/api/machines/ocm/bulk', async (req, res) => {
  try {
    const result = await db.collection('ocm_machines').insertMany(req.body);
    res.status(201).json({ insertedCount: result.insertedCount });
  } catch (error) {
    console.error("Error adding OCM machines in bulk:", error);
    res.status(500).json({ error: "Failed to add OCM machines" });
  }
});

app.delete('/api/machines/ppm/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('ppm_machines').deleteOne({ id });
    res.json({ deleted: result.deletedCount > 0 });
  } catch (error) {
    console.error("Error deleting PPM machine:", error);
    res.status(500).json({ error: "Failed to delete PPM machine" });
  }
});

app.delete('/api/machines/ocm/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('ocm_machines').deleteOne({ id });
    res.json({ deleted: result.deletedCount > 0 });
  } catch (error) {
    console.error("Error deleting OCM machine:", error);
    res.status(500).json({ error: "Failed to delete OCM machine" });
  }
});

// Start server
(async () => {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
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
