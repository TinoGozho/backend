// index.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin using your service account JSON.
// Make sure the file path is correct and that the file is deployed along with your app.
const serviceAccount = require('./privatekey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();

const app = express();
// Use the dynamic port provided by Render, falling back to 3000 if needed.
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Optional: Set COOP header to avoid some popup warnings.
// NOTE: Adjust this only if it fits your security model.
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// Configure CORS.
// Add all origins you expect (both your deployed front-end and local testing).
app.use(
  cors({
    origin: ['https://tinogozho.github.io/frontend/', 'http://localhost:8000']
  })
);

// POST endpoint to add/update a user document in Firestore.
app.post('/users', async (req, res) => {
  try {
    const { uid, role } = req.body;

    if (!uid || !role) {
      return res.status(400).json({ error: 'Missing uid or role' });
    }

    // Use uid as the document ID in the "Users" collection.
    await db
      .collection('Users')
      .doc(uid)
      .set(
        {
          role: role,
          status: 'active' // or any default status you need
        },
        { merge: true }
      );

    console.log(`User document for ${uid} saved/updated successfully.`);
    res.json({ success: true });
  } catch (error) {
    // Log the error so you can review it on Render's logs.
    console.error('Error writing document: ', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
