const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const keyword = {
  'quotes': [
    'https://api.quotable.io/random',
    'https://api.quotable.io/random',
    'https://api.quotable.io/random'
  ],
  'exchange': [
    'https://api.exchangerate-api.com/v4/latest/USD',
    'https://api.exchangerate-api.com/v4/latest/EUR',
    'https://api.exchangerate-api.com/v4/latest/GBP'
  ],
  'books': [
    'https://www.googleapis.com/books/v1/volumes?q=javascript',
    'https://www.googleapis.com/books/v1/volumes?q=python',
    'https://www.googleapis.com/books/v1/volumes?q=java'
  ],
  'astronomy': [
    'https://api.le-systeme-solaire.net/rest/bodies/',
    'https://api.nasa.gov/planetary/apod?api_key=YOUR_API_KEY',
    'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=YOUR_API_KEY'
  ],
  'crypto': [
    'https://api.coinlore.net/api/ticker/?id=90',
    'https://api.coinlore.net/api/ticker/?id=80',
    'https://api.coinlore.net/api/ticker/?id=70'
  ],
  'technology': [
    'https://api.github.com/users/octocat',
    'https://api.github.com/users/github',
    'https://api.github.com/users/google'
  ]
};


const shortenUrl = async (url) => {
  try {
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error('Error shortening URL:', error);
    return url;  
  }
};

app.get('/urls/:keyword', async (req, res) => {
  const keyword = req.params.keyword;
  const urls = keyword[keyword];
  if (urls) {
    try {
      const shortenedUrls = await Promise.all(urls.map(url => shortenUrl(url)));
      res.json(shortenedUrls);
    } catch (error) {
      res.status(500).send('Error shortening URLs');
    }
  } else {
    res.status(404).send('Keyword not found');
  }
});

app.get('/download', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    const response = await axios.get(url, {
      responseType: 'text'
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error downloading content');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});