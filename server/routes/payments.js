const express = require('express');
const router = express.Router();
const axios = require('axios');
const admin = require('firebase-admin');

const db = admin.firestore();

// Initialize Paystack
const paystackApi = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Initialize payment
router.post('/initialize', async (req, res) => {
  try {
    const { email, amount, plan } = req.body;
    
    const response = await paystackApi.post('/transaction/initialize', {
      email,
      amount: amount * 100, // Convert to kobo
      callback_url: `${req.protocol}://${req.get('host')}/payment/callback`,
      metadata: {
        plan_type: plan
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Paystack Error:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const response = await paystackApi.get(`/transaction/verify/${reference}`);
    const { status, data } = response.data;

    if (status && data.status === 'success') {
      // Update user subscription in Firestore
      const { email, metadata } = data.customer;
      const userRef = db.collection('users').where('email', '==', email);
      const userDoc = await userRef.get();

      if (!userDoc.empty) {
        await userDoc.docs[0].ref.update({
          subscription: {
            plan: metadata.plan_type,
            status: 'active',
            startDate: admin.firestore.FieldValue.serverTimestamp(),
            endDate: admin.firestore.FieldValue.serverTimestamp() + (30 * 24 * 60 * 60 * 1000) // 30 days
          }
        });
      }

      res.json({ success: true, data });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle webhook
router.post('/webhook', async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      const event = req.body;
      
      // Handle different event types
      switch(event.event) {
        case 'subscription.create':
          // Handle new subscription
          break;
        case 'subscription.disable':
          // Handle subscription cancellation
          break;
        // Add more event handlers as needed
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(500);
  }
});

module.exports = router;