const express = require('express');
const router = express.Router();
const axios = require('axios');

const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0';

// Send WhatsApp message
async function sendWhatsAppMessage(to, message) {
  try {
    const response = await axios.post(
      `${WHATSAPP_API_URL}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('WhatsApp API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Send job alert
router.post('/send-alert', async (req, res) => {
  try {
    const { phoneNumber, jobDetails } = req.body;
    
    const message = `🎯 New Job Match!\n\n` +
      `${jobDetails.title}\n` +
      `Company: ${jobDetails.company}\n` +
      `Location: ${jobDetails.location}\n\n` +
      `💡 AI Match Score: ${jobDetails.matchScore}%\n\n` +
      `Apply now: ${jobDetails.applyUrl}`;

    const result = await sendWhatsAppMessage(phoneNumber, message);
    res.json({ success: true, messageId: result.messages[0].id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;