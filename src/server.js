const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('ELDOOB.DZ B2B Dropshipping Platform is Running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
