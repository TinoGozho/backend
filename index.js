// index.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');


// Initialize Firebase Admin
// Choose one of the following methods:



// Option 2: Using a service account JSON file:
const serviceAccount = require('./privatekey.json'); // Ensure the path is correct
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// POST endpoint to add/update a user document in Firestore
app.post('/users', async (req, res) => {
  try {
    const { uid, role } = req.body;

    if (!uid || !role) {
      return res.status(400).json({ error: 'Missing uid or role' });
    }

    // Use uid as the document ID in the "users" collection.
    await db.collection('Users').doc(uid).set({
      role: role,
      status: 'active'  // or any default status you need
    }, { merge: true });  // merge:true allows you to update existing documents without overwriting all fields

    console.log(`User document for ${uid} saved/updated successfully.`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error writing document: ', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

  
