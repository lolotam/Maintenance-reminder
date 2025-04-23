
# MongoDB Atlas Integration Guide

## Step 1: Update your MongoDB Connection String

1. Replace the placeholder password in the `.env` file with your actual MongoDB Atlas password
2. The connection string should look like this:
   ```
   MONGO_URI=mongodb+srv://lolotam:yourActualPassword@cluster1000.4zvov8d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1000
   ```

## Step 2: Set Up MongoDB Atlas

1. In your MongoDB Atlas account:
   - Create a new database called `maintenance_app`
   - Create two collections: `ppm_machines` and `ocm_machines`

2. Set up Network Access:
   - Go to Network Access in your MongoDB Atlas dashboard
   - Add your IP address to the IP Access List (or use 0.0.0.0/0 for development)

## Step 3: Start the Server

1. Open a terminal and run:
   ```
   node server.js
   ```

2. You should see "Connected to MongoDB Atlas" and "Server running on port 3001"

## Step 4: Run the Application

1. In another terminal, start the React application:
   ```
   npm run dev
   ```

2. The application will now store and retrieve data from MongoDB Atlas instead of using localStorage

## Troubleshooting

- If you see connection errors, verify:
  - Your MongoDB Atlas username and password are correct
  - Your IP address is in the MongoDB Atlas Network Access list
  - Your MongoDB Atlas cluster is running

- If data isn't showing up in the application:
  - Check the server console for any error messages
  - Verify that the collections were created correctly
  - Check the React application console for any API errors
