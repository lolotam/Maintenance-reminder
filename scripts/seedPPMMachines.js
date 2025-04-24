
require('dotenv').config();
const { MongoClient } = require('mongodb');

const samplePPMMachines = [
  {
    equipment: "Patient Monitor",
    model: "VITAPIA7000",
    serial: "22030100054",
    manufacturer: "Trismed Co.",
    logNo: "2255",
    dates: {
      Q1: "2025-03-20",
      Q2: "2025-06-18",
      Q3: "2025-09-16",
      Q4: "2025-12-15"
    },
    engineers: {
      Q1: "Jayaprakash",
      Q2: "Nixon",
      Q3: "Jayaprakash",
      Q4: "Nixon"
    }
  },
  {
    equipment: "Ventilator",
    model: "HAMILTON-C6",
    serial: "22030100055",
    manufacturer: "Hamilton Medical",
    logNo: "2256",
    dates: {
      Q1: "2025-03-21",
      Q2: "2025-06-19",
      Q3: "2025-09-17",
      Q4: "2025-12-16"
    },
    engineers: {
      Q1: "Nixon",
      Q2: "Jayaprakash",
      Q3: "Nixon",
      Q4: "Jayaprakash"
    }
  },
  {
    equipment: "Defibrillator",
    model: "LIFEPAK-15",
    serial: "22030100056",
    manufacturer: "Stryker",
    logNo: "2257",
    dates: {
      Q1: "2025-03-22",
      Q2: "2025-06-20",
      Q3: "2025-09-18",
      Q4: "2025-12-17"
    },
    engineers: {
      Q1: "Jayaprakash",
      Q2: "Nixon",
      Q3: "Jayaprakash",
      Q4: "Nixon"
    }
  }
];

async function insertPPMMachines() {
  const client = new MongoClient(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db('maintenanceApp');
    const collection = db.collection('ppmMachines');

    // Insert the sample machines
    const result = await collection.insertMany(samplePPMMachines);
    console.log(`✅ Successfully inserted ${result.insertedCount} PPM machines`);
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await client.close();
    console.log('📌 MongoDB connection closed');
  }
}

// Execute if running directly (node scripts/seedPPMMachines.js)
if (require.main === module) {
  insertPPMMachines()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to seed database:', error);
      process.exit(1);
    });
}

// Export for use in other files
module.exports = { insertPPMMachines };

