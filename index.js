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
    origin: ['https://tinogozho.github.io', 'http://localhost:8000' , 'https://pixelbub.github.io', 'https://victorious-bush-007efa41e.6.azurestaticapps.net']
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
// GET /availability
app.get('/availability', async (req, res) => {
  try {
    const { facilityId, date } = req.query;
    if (!facilityId || !date) 
      return res.status(400).json({ error: 'Missing parameters' });

    // Load facility capacity
    const facSnap = await db.collection('Facility').doc(facilityId).get();
    if (!facSnap.exists)
      return res.status(404).json({ error: 'Facility not found' });
    const capacity = facSnap.data().capacity;

    const dateObj = new Date(date);
    // Fetch all bookings, events, and closures that overlap this date
    const dayStart = admin.firestore.Timestamp.fromDate(new Date(dateObj.setHours(0,0,0,0)));
    const dayEnd   = admin.firestore.Timestamp.fromDate(new Date(dateObj.setHours(23,59,59,999)));

    // Parallel fetches
    const [bookingsSnap, eventsSnap, closuresSnap] = await Promise.all([
      db.collection('Booking')
        .where('facility_id','==',facilityId)
        .where('status','==','approved')
        .where('start_time','<', dayEnd)
        .where('end_time','>', dayStart)
        .get(),
      db.collection('Events')
        .where('facility_id','==',facilityId)
        .where('start_time','<', dayEnd)
        .where('end_time','>', dayStart)
        .get(),
      db.collection('Closure')
        .where('facility_id','==',facilityId)
        .where('start_time','<', dayEnd)
        .where('end_time','>', dayStart)
        .get()
    ]);

    // Helper to check overlap
    const overlaps = (slotStart, slotEnd, doc) => {
      const st = doc.data().start_time.toDate();
      const en = doc.data().end_time.toDate();
      return st < slotEnd && en > slotStart;
    };

    // Build availability
    const slots = [];
    for (let hour = 5; hour < 20; hour++) {
      const slotStart = new Date(date); slotStart.setHours(hour,0,0,0);
      const slotEnd   = new Date(date); slotEnd.setHours(hour+1,0,0,0);

      // Check events
      const ev = eventsSnap.docs.find(d => overlaps(slotStart, slotEnd, d));
      if (ev) {
        slots.push({
          start: slotStart.toISOString(),
          end:   slotEnd.toISOString(),
          isEvent: true,
          title: ev.data().title || 'Event'
        });
        continue;
      }

      // Check closures
      const cl = closuresSnap.docs.find(d => overlaps(slotStart, slotEnd, d));
      if (cl) {
        slots.push({
          start: slotStart.toISOString(),
          end:   slotEnd.toISOString(),
          isEvent: true,
          title: cl.data().reason || 'Closed'
        });
        continue;
      }

      // Otherwise, compute remaining capacity from bookings
      const used = bookingsSnap.docs
        .filter(d => overlaps(slotStart, slotEnd, d))
        .reduce((sum, d) => sum + (d.data().group_size || 1), 0);
      const remaining = capacity - used;
      if (remaining > 0) {
        slots.push({
          start: slotStart.toISOString(),
          end:   slotEnd.toISOString(),
          remainingCapacity: remaining,
          isEvent: false
        });
      }
    }

    res.json(slots);
  } catch (err) {
    console.error('Availability error:', err);
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

// POST /reports - create a new report
app.post('/reports', async (req, res) => {
  try {
    const { user_uid, title, description, status, facility_id } = req.body;

    if (!user_uid || !title || !description || !status || !facility_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch the facility name
    const facilityRef = db.collection('Facility').doc(facility_id);
    const facilityDoc = await facilityRef.get();
    if (!facilityDoc.exists) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    const facility_name = facilityDoc.data().facility_name;

    // Save the report with facility name
    await db.collection('Report').add({
      user_uid,
      title,
      description,
      status,
      facility_id,
      facility_name,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ success: true, message: 'Report submitted successfully' });

  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET /reports?user_uid=... - list reports for a user
app.get('/reports', async (req, res) => {
  try {
    const user_uid = req.query.user_uid;
    if (!user_uid) return res.status(400).json({ error: 'Missing user_uid' });

    const snapshot = await db.collection('Report')
      .where('user_uid', '==', user_uid)
      .orderBy('created_at', 'desc')
      .get();

    const reports = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        status: data.status,
        facility_id: data.facility_id,
        feedback : data.feedback || null,
        facility_name: data.facility_name,
        created_at: data.created_at?.toDate().toISOString() || null
      };
    });

    res.json(reports);

  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all reports (for admin view)
app.get('/admin/reports', async (req, res) => {
  try {
    const snapshot = await db.collection('Report')
      .orderBy('created_at', 'desc')
      .get();
    const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH report status or feedback

app.patch('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const reportRef = db.collection('Report').doc(id);
    const reportSnap = await reportRef.get();

    if (!reportSnap.exists) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const before = reportSnap.data();
    const now = admin.firestore.FieldValue.serverTimestamp();
    const batch = db.batch();

    // 1) Update report
    const updates = { updated_at: now };
    if (status && status !== before.status)       updates.status   = status;
    if (feedback && feedback !== before.feedback) updates.feedback = feedback;
    batch.update(reportRef, updates);

    await batch.commit();

    // 2) Send a notification to the user
    const userUid = before.user_uid; // assuming this field exists in the report
    const notifRef = db
      .collection('users')
      .doc(userUid)
      .collection('Notification')
      .doc();

    const message = `Your report "${before.title}" was updated.` +
                    (status ? ` Status: ${status}.` : '') +
                    (feedback ? ` Feedback: ${feedback}` : '');

    await notifRef.set({
      type: 'report_update',
      message,
      read: false,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: 'Report updated and user notified' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Update failed' });
  }
});






// POST /events
// POST /events
app.post('/events', async (req, res) => {
  const { facility_id, start_time, end_time, title, description, all_day } = req.body;
  if (!facility_id || !title || description == null)
    return res.status(400).json({ error: 'Missing fields' });

  // Compute timestamps
  let startTs, endTs;
  if (all_day) {
    // full day: midnight to 23:59:59 of today, or indefinite if you prefer null
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    endTs = admin.firestore.Timestamp.fromDate(new Date(tomorrow - 1));
    startTs = admin.firestore.Timestamp.fromDate(today);
  } else {
    if (!start_time || !end_time)
      return res.status(400).json({ error: 'Missing time fields' });
    startTs = admin.firestore.Timestamp.fromDate(new Date(start_time));
    endTs   = admin.firestore.Timestamp.fromDate(new Date(end_time));
  }

  const now = admin.firestore.FieldValue.serverTimestamp();
  const eRef = db.collection('Events').doc();
  await eRef.set({ facility_id, title, description, all_day, start_time: startTs, end_time: endTs, created_at: now });

  // Notify all users
  const users = await db.collection('users').get();
  const batch = db.batch();
  users.docs.forEach(u => {
    const nRef = db.collection('users').doc(u.id).collection('Notification').doc();
    const msgTime = all_day
      ? `All-day event "${title}"`
      : `New event "${title}" on ${new Date(start_time).toLocaleString()}`;
    batch.set(nRef, { user_uid: u.id, type: 'event', message: msgTime, read: false, created_at: now });
  });
  await batch.commit();
  
  res.json({ success: true, eventId: eRef.id });
});

// POST /closures
app.post('/closures', async (req, res) => {
  const { facility_id, start_time, end_time, reason, all_day } = req.body;
  if (!facility_id || !reason)
    return res.status(400).json({ error: 'Missing fields' });

  let startTs, endTs;
  if (all_day) {
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    startTs = admin.firestore.Timestamp.fromDate(today);
    endTs   = admin.firestore.Timestamp.fromDate(new Date(tomorrow - 1));
  } else {
    if (!start_time || !end_time)
      return res.status(400).json({ error: 'Missing time fields' });
    startTs = admin.firestore.Timestamp.fromDate(new Date(start_time));
    endTs   = admin.firestore.Timestamp.fromDate(new Date(end_time));
  }

  const now = admin.firestore.FieldValue.serverTimestamp();
  const cRef = db.collection('Closure').doc();
  await cRef.set({ facility_id, reason, all_day, start_time: startTs, end_time: endTs, created_at: now });

  // Notify users
  const users = await db.collection('users').get();
  const batch = db.batch();
  users.docs.forEach(u => {
    const nRef = db.collection('users').doc(u.id).collection('Notification').doc();
    const msgText = all_day
      ? `Facility "${facility_id}" closed all-day for "${reason}"`
      : `Facility "${facility_id}" closed for "${reason}" on ${new Date(start_time).toLocaleString()}`;
    batch.set(nRef, { type: 'closure', message: msgText, read: false, created_at: now });
  });
  await batch.commit();

  res.json({ success: true, closureId: cRef.id });
});

// server.js or notifications.js (depending on how you're structured)
app.get('/notifications/unread/:userUid', async (req, res) => {
  const userUid = req.params.userUid;

  try {
    const snapshot = await db
      .collection('users')
      .doc(userUid)
      .collection('Notification')
      .where('read', '==', false)
      .get();

    const unread = [];
    snapshot.forEach(doc => {
      unread.push({ id: doc.id, ...doc.data() });
    });

    res.json(unread);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.patch('/notifications/mark-read/:userUid/:notifId', async (req, res) => {
  const { userUid, notifId } = req.params;
  try {
    await db.collection('users').doc(userUid)
      .collection('Notification').doc(notifId)
      .update({ read: true });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not mark notification as read' });
  }
});

app.get('/notifications/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const notifRef = db.collection('users').doc(uid).collection('Notification');
    const snapshot = await notifRef.orderBy('created_at', 'desc').get();

    const notifications = [];
    const batch = db.batch();

    snapshot.forEach(doc => {
      const data = doc.data();
      notifications.push({ id: doc.id, ...data });

      if (!data.read) {
        batch.update(doc.ref, { read: true });
      }
    });

    await batch.commit(); // Mark all unread as read
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});










app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

