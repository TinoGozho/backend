// index.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin using your service account JSON.
// Make sure the file path is correct and that the file is deployed along with your app.
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "sd-project-c2b6c",
    clientEmail: "firebase-adminsdk-fbsvc@sd-project-c2b6c.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC79ANVPZcMyla5\n3Y96UjNDQjnF0PQE0cSUV820UPJMWTyKnAi7pjroPVf29zQOSXA6EVGCqXACHo9/\nLe8AK4OiCpTxUT4QxO+6cUgOJa3QEkXck+jDe+gpPTkSp5jb5QXVW0p3cIvSpRsP\nfiN9o5LfSfnzblxKdtvej36fhMLjjUxZcSt2GsvlrKCf7Dgm7IRlvvuc/LW2zbzs\nR6/ZblXZyeAvJ9h5rZaWBJjE7fPq/tgJklIHMNyjnS4W05d84EOZW5Gc/bZXE3Xq\nRcd+5Qjsuzatd7FzK5lGSe0qz1MOblkTk6U1h9UpS8osJmJUlBzhzzDjnLznJUJ3\n4CEz/HNnAgMBAAECggEAASj55kpJhuIu09nau1oLh/Q+MArgnrD+wh2inuTLAg6g\n8YgSA7p8bZeHVfZjo1zvrOQTeTd7gf/XSeUqLvmVx+fB0JV8SRU2F5QAalnwLzMV\nrE1bZ+15WtvOYN+Y8W6B8TWtiXwv2L59IsTYCjv6uZcWzFpXhnwiUkbXdLuYilf/\nsguN23+g0kjPiWoHU5s9YmzJGhwAwxKh7vN4Luu4gw59cKZOm1926wiZ0D8F8b9H\noMdEPjjEQblWIOBtXZUYfjcoqDQK7O/oa7W1hngC2J/1uPkfUOsWwpITvu22R3Nj\nBgAho/Qyv9AKEQ1IZzX6sFKR4bH79qx9UDo3FT/m0QKBgQDz5X4y7Ty+1JXRWgQQ\n/2D7IsYlzvMLdFCgqFQxt6qxAlQdn7p3H55ouF0QciZrBKnkLyPijeNOfRQFR4/e\n0BtP/rRDd+ylX2PG4q2xcGHjCNSA0jup49gp2H4ZntnQ82fr0PVuwTa9e2WCS7bo\niomk3AZdmNydvppNkUdw+jYq8QKBgQDFR85TUdDf3wIJrBNaVRIHarxgyduL1WI1\nhxkQZYsLMVPnLc6ucwNJZbYvgCI7hGj3nRvUvfbdRDjghsO57z8MuO+IxgIcsEa3\nLsAgEfhZEUZfMbiGHDOtqqfeTVSgEHpCnLSXOySpjR+iAR/C5BA6cTXeMxo05Imy\n8addVzaT1wKBgHAbUMK/4Wgl9ydfpPbbLAzDkyjV00m0kUsHlIu1zLPISjnDrcYL\ntpiUBdMFZTtTzXOhZ3E/nvf47jbvCeZ06dj/ToSknxX0nrxQfV5ONfBRorwD5oDU\nxguWA4BrT9uHxoDSb74U+cBm8+XMP6rr4xDwQczL8rxfXDXDTX9Uw4lBAoGAeAhH\nllRqdTwX3lCveb/W92JO+cj35u3PEmh/rIVMA2Rg+4DYhzX9YvQa1G3u5i2bPEWA\nQIHQqTIwNRRqFEBoKVKAk8R+Vnw+mog8Z4bnhzHGkncLIbYZD2qNNunwOm+sI8l6\n66UVmn/+JjDu5UKkSRrGvspzAImo6pKz1UwSLgMCgYEAlLpEWP/YSdGeADGJFw5o\nkZ5wN+8BKGhDkCe7pAYPQRqmKzqaVrgJvNdnE53G12pc2YNkGmzPvNxnAS6uLGDx\n/ly7i0h1zHJ29VCh7CLCgImas2g3yWvtY9JR1Cicu9rR9Xqaq6jybBf+iacIFkcF\nFOJvqFgHgDlY49wFo7bTZiw=\n-----END PRIVATE KEY-----\n"
  })
});
// PATCH endpoint to update user status



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
  origin: ['https://tinogozho.github.io', 'http://localhost:8000', 'https://pixelbub.github.io', 'https://victorious-bush-007efa41e.6.azurestaticapps.net']
})

);
// GET all users
app.get('/users', async (req, res) => {
  try {
    // Fetch every document in the 'users' collection
    const snapshot = await db.collection('users').get();
    // Map each document to an object { uid, ...data }
    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
    res.json(users);
  } catch (err) {
    console.error('Error fetching all users:', err);
    res.status(500).json({ error: err.message });
  }
});
// GET all facilities
app.get('/facilities', async (req, res) => {
  try {
    const snapshot = await db.collection('Facility').get();
    const facilities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json(facilities);
  } catch (err) {
    console.error('Error fetching facilities:', err);
    res.status(500).json({ error: 'Failed to fetch facilities.' });
  }
});



app.get('/users/:uid', async (req, res) => {
  try {

    const uid = req.params.uid;
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      // User not found – advise them to sign up.
      return res.status(404).json({ error: 'User not found, please sign up first.' });
    }

    // Return the user's data (for now, just the first name).
    const userData = userDoc.data();
    res.json({ 
      success: true, 
      first_name: userData.first_name, 
      last_name: userData.last_name,
      role: userData.role ,
      status: userData.status

    });
    
  } catch (error) {
    console.error('Error fetching user document:', error);
    res.status(500).json({ error: error.message });
  }
});
app.patch('/users/:uid/status', async (req, res) => {
  try {
    const uid = req.params.uid;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Missing status in request body.' });
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await userRef.update({ status });

    res.json({ success: true, message: `User ${uid} status updated to ${status}` });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE endpoint to remove a user document from Firestore.
app.delete('/users/:uid', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.uid).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// POST endpoint to add/update a user document in Firestore.
// index.js (backend)
app.post('/users', async (req, res) => {
  try {
    const { uid, role, first_name, last_name } = req.body;

    if (!uid || !role) {
      return res.status(400).json({ error: 'Missing uid or role' });
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // User already exists
      return res.status(400).json({ error: 'User already exists. Please log in instead.' });
    }

    // Create new user
    await userRef.set({
      role,
      first_name,
      last_name,
      status: 'pending'
    });

    console.log(`User document for ${uid} created successfully.`);

    res.json({ success: true, first_name, role });

  } catch (error) {
    console.error('Error writing document: ', error);
    res.status(500).json({ error: error.message });
  }
});
// CREATE a booking (resident)
// POST /bookings - Complete implementation
app.post('/bookings', async (req, res) => {
  try {
    const {
      user_uid,
      facility_id,
      group_size,
      start_time,
      end_time
    } = req.body;
    
    if (!user_uid || !facility_id || !group_size || !start_time || !end_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 2. Parse dates
    const start = new Date(start_time);
    const end   = new Date(end_time);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ error: 'Invalid start_time format' });
    }
    if (isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid end_time format' });
    }

    // 3. Validate slot duration (exactly 1 hour)
    const slotDuration = end - start;
    if (slotDuration !== 60 * 60 * 1000) {
      return res.status(400).json({ error: 'Time slots must be exactly 1 hour' });
    }

    /*// 4. Validate business hours (05:00-20:00 UTC)
    const startHour = start.getUTCHours();
    if (startHour < 5 || startHour >= 20) {
      return res.status(400).json({ error: 'Bookings only available between 05:00 and 20:00 UTC' });
    }*/

    // 5. Get facility capacity from "Facility" collection
    const facilityRef = db.collection('Facility').doc(facility_id);
    const facilityDoc = await facilityRef.get();
    if (!facilityDoc.exists) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    const capacity = facilityDoc.data().capacity;

    // 6. Validate group size
    if (group_size < 1 || group_size > capacity) {
      return res.status(400).json({ error: `Group size must be between 1 and ${capacity}` });
    }


    // 7. Check overlapping bookings in "Booking" collection
    const overlappingSnap = await db.collection('Booking')
      .where('facility_id', '==', facility_id)
      .where('status', '==', 'approved')
      .where('start_time', '<', end)
      .where('end_time',   '>', start)
      .get();

    const totalBooked = overlappingSnap.docs.reduce((sum, doc) => {
      return sum + (doc.data().group_size || 1);
    }, 0);

    if (totalBooked + group_size > capacity) {
      return res.status(409).json({ error: 'Not enough available capacity for selected time' });
    }

    // 8. Create booking with snake_case fields

    const bookingRef = await db.collection('Booking').add({
      user_uid:     user_uid,
      facility_id: facility_id,
      group_size:  group_size,
      start_time:  admin.firestore.Timestamp.fromDate(start),
      end_time:    admin.firestore.Timestamp.fromDate(end),
      status:      'pending',
      created_at:  admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, bookingId: bookingRef.id, message: 'Booking request submitted successfully' });

  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// LIST bookings (resident or admin)
// Update your GET /bookings endpoint
// Update your GET /bookings endpoint
app.get('/bookings', async (req, res) => {
  try {
    const snapshot = await db.collection('Booking')
      .where('status', '==', req.query.status)
      .get();
    
    const bookings = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        facilityId: data.facility_id,
        status: data.status,
        user_uid: data.user_uid,
        // Convert Firestore timestamps to ISO strings
        startTime: data.start_time.toDate().toISOString(),
        endTime: data.end_time.toDate().toISOString()
      };
    });
    
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Add new endpoint to check availability
app.get('/availability', async (req, res) => {
  try {
    const { facilityId, date } = req.query;
    if (!facilityId || !date) 
      return res.status(400).json({ error: 'Missing parameters' });

    // ← here we point at the right collection name
    console.log(`Looking up facility "${facilityId}" in "Facility"`);
    const facilitySnap = await db.collection('Facility').doc(facilityId).get();

    if (!facilitySnap.exists) 
      return res.status(404).json({ error: 'Facility not found' });

    const capacity = facilitySnap.data().capacity;
    const dateObj = new Date(date);
    const slots = [];

    for (let hour = 5; hour < 20; hour++) {
      const start = new Date(dateObj); start.setHours(hour,0,0,0);
      const end   = new Date(start);   end.setHours(hour+1,0,0,0);

      const bookingsSnap = await db.collection('Booking')
        .where('facility_id','==',facilityId)
        .where('status','==','approved')
        .where('start_time','<', end)
        .where('end_time','>', start)
        .get();

      const used = bookingsSnap.docs
        .reduce((sum, d) => sum + (d.data().group_size||1), 0);
      const remaining = capacity - used;
      if (remaining > 0) {
        slots.push({
          start: start.toISOString(),
          end:   end.toISOString(),
          remainingCapacity: remaining
        });
      }
    }

    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// ADMIN: Approve or block a booking
// Update your booking status endpoint in index.js
// In your index.js, verify this endpoint exists:
app.patch('/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!id) return res.status(400).json({ error: 'Missing booking ID' });
    if (!['approved', 'blocked'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const bookingRef = db.collection('Booking').doc(id);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await bookingRef.update({ status });
    res.json({ success: true, message: `Booking ${id} updated to ${status}` });

  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ error: err.message });
  }
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

