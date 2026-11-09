const express = require('express');
const { query } = require('./db');
const { sendOrderNotification } = require('./mailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('ELDOOB.DZ B2B Dropshipping Platform is Running Successfully!');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await query('SELECT NOW()');
    res.json({ success: true, db_time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
