require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

let isUrl = require ('is-url');
let bodyParser = require ('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// My solution

let shortUrlCounter = 0;
const urlsObject = {};

app.use("/api/shorturl", bodyParser.urlencoded({ extend:false }));

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;

  if (!isUrl(url)) return res.json({ error: "invalid url" });

  shortUrlCounter += 1;
  urlsObject[shortUrlCounter] = url;
  
  res.json({ original_url: url, short_url: shortUrlCounter });
});

app.get("/api/shorturl/:shortenedUrl", (req, res) => {
  const shortenedUrl = req.params.shortenedUrl;
  const url = urlsObject[shortenedUrl];

  res.status(301).redirect(url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
