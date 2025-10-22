require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const NodeCache = require('node-cache');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID
});

// Initialize Express
const app = express();
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/whatsapp', require('./routes/whatsapp'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});