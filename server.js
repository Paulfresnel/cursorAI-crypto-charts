const express = require('express');
const axios = require('axios');

const app = express();

app.get('/api/*', async (req, res) => {
  const url = `https://api.coingecko.com/api/v3${req.path.slice(4)}${req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`;
  console.log('Proxying request to:', url);
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
