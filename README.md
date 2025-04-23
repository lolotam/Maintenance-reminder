
# Maintenance Schedule App

This application helps manage maintenance schedules for PPM (Planned Preventive Maintenance) and OCM (Operational Condition Monitoring) machines.

## Setup Instructions

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new project and cluster
3. Get your connection string from the MongoDB Atlas dashboard
4. Replace the placeholder in the `.env` file with your actual connection string:

```
MONGO_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/?retryWrites=true&w=majority
```

### Running the Application

1. Start the MongoDB backend server:
```bash
node server.js
```

2. In a separate terminal, start the React frontend:
```bash
npm run dev
```

3. The application should now be running with MongoDB Atlas integration.

### Using the Application

- The app will store data in MongoDB Atlas, allowing access from any device
- All data will be synced across devices when connected to the internet
- Upload machine data using Excel templates
- View and manage PPM and OCM machines separately

## Technologies Used

- React with TypeScript
- MongoDB Atlas for cross-device data storage
- Express for the backend API
- React Query for data fetching and state management
- Tailwind CSS and shadcn/ui for styling
