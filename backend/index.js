const express = require("express");
const { TwitterApi } = require("twitter-api-v2");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const OAuth = require("oauth").OAuth;
const multer = require("multer");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

const upload = multer({ dest: 'uploads/' });

const requestUrl = 'https://api.twitter.com/oauth/request_token';
const accessUrl = 'https://api.twitter.com/oauth/access_token';
const twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const callbackUrl = 'http://localhost:3000/twitter/callback';

const oa = new OAuth(
  requestUrl,
  accessUrl,
  twitterConsumerKey,
  twitterConsumerSecret,
  '1.0A',
  callbackUrl,
  'HMAC-SHA1'
);

app.get('/twitter/auth', (req, res) => {
  oa.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
    if (error) {
      console.error('Error getting OAuth request token:', error);
      res.status(500).send('Error getting OAuth request token');
    } else {
      res.json({ oauthToken, oauthTokenSecret });
    }
  });
});

app.post('/twitter/access-token', (req, res) => {
  const { oauth_token, oauth_verifier } = req.body;

  oa.getOAuthAccessToken(oauth_token, null, oauth_verifier, (error, oauth_access_token, oauth_access_token_secret) => {
    if (error) {
      console.error('Error getting access token:', error);
      res.status(500).json({ error: 'Error getting access token' });
    } else {
      res.json({ oauth_access_token, oauth_access_token_secret });
    }
  });
});

app.post('/twitter/post', upload.single('media'), async (req, res) => {
  const { text, oauth_access_token, oauth_access_token_secret } = req.body;
  const mediaPath = req.file ? req.file.path : null;

  if (!text) {
    return res.status(400).send('Tweet text is required');
  }

  if (!oauth_access_token || !oauth_access_token_secret) {
    return res.status(400).send('OAuth token and secret are required');
  }

  try {
    const userClient = new TwitterApi({
      appKey: twitterConsumerKey,
      appSecret: twitterConsumerSecret,
      accessToken: oauth_access_token,
      accessSecret: oauth_access_token_secret,
    });

    let mediaId;
    if (mediaPath) {
      const mediaType = path.extname(mediaPath).slice(1); // get the file extension
      const mediaData = fs.readFileSync(mediaPath);
      mediaId = await userClient.v1.uploadMedia(mediaData, { mimeType: `image/${mediaType}` });
      fs.unlinkSync(mediaPath); // Remove the temporary file
    }

    const tweetParams = {
      text,
      ...(mediaId && { media: { media_ids: [mediaId] } }),
    };

    const response = await userClient.v2.tweet(tweetParams);

    res.json({ tweet: response.data });
  } catch (error) {
    console.error('Error posting tweet:', error);
    res.status(500).json({ error: 'Error posting tweet', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
