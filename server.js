const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Sample data for keywords and URLs
const data = {
  "keyword1": ["https://www.piknik.info", "https://www.piknik.info/gallery/index?year=2024"],
  "keyword2": ["https://www.piknik.info/concerts", "http://qazimodo.ru/site/"]
};

app.use(express.static('public'));

// Endpoint to get URLs by keyword
app.get('/api/urls', (req, res) => {
  const keyword = req.query.keyword?.trim();
  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }
  
  const urls = data[keyword];
  if (urls) {
    res.json(urls);
  } else {
    res.status(404).json({ error: "Keyword not found" });
  }
});

// Endpoint to download content from a URL
app.get('/api/download', async (req, res) => {
  const url = req.query.url?.trim();
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    
    if (!contentType) {
      return res.status(500).json({ error: "Unable to determine content type" });
    }
    
    res.set('Content-Type', contentType);
    res.set('Content-Disposition', `attachment; filename="${encodeURIComponent(url.split('/').pop())}"`);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error downloading content", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
