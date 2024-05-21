// backend/index.js
const express = require("express");
const bodyParser = require("body-parser");
const OAuth = require("oauth").OAuth;
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Enable CORS for specific origin
app.use(cors({
  origin: "http://localhost:3000"
}));

const requestUrl = "https://api.twitter.com/oauth/request_token";
const accessUrl = "https://api.twitter.com/oauth/access_token";  
const twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const callbackUrl = "http://localhost:3000/twitter/callback";

const oa = new OAuth(
  requestUrl,
  accessUrl,
  twitterConsumerKey,
  twitterConsumerSecret,
  "1.0A",
  callbackUrl,
  "HMAC-SHA1"
);

app.post("/twitter/access-token", (req, res) => {
  const { oauth_token, oauth_verifier } = req.body;

  oa.getOAuthAccessToken(oauth_token, null, oauth_verifier, (error, oauth_access_token, oauth_access_token_secret) => {
    if (error) {
      res.status(500).json({ error: "Error getting access token" });
    } else {
      res.json({ oauth_access_token, oauth_access_token_secret });
    }
  });
});

app.get("/twitter/auth", (req, res) => {
  oa.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error getting OAuth request token");
    } else {
      res.json({ oauthToken, oauthTokenSecret });
    }
  });
});

app.get("/twitter/callback", (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;
  oa.getOAuthAccessToken(
    oauth_token,
    null,
    oauth_verifier,
    (error, oauthAccessToken, oauthAccessTokenSecret) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error getting OAuth access token");
      } else {
        res.json({ oauthAccessToken, oauthAccessTokenSecret });
      }
    }
  );
});

// Twitter API v2 Bearer Token for authentication
const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;

app.post("/twitter/post", async (req, res) => {
  const { text } = req.body; // Use 'text' field for Twitter API v2

  if (!twitterBearerToken) {
    res.status(400).send("Bearer token missing");
    return;
  }

  try {
    const response = await axios.post(
      "https://api.twitter.com/2/tweets",
      { text: text },
      {
        headers: {
          "Authorization": `Bearer ${twitterBearerToken}`,
          "Content-Type": "application/json"
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting tweet");
  }
});
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
