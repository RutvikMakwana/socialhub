const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

const twitterClient = new Twitter({
  consumer_key: "FSo8GjKmCR5YEyXTfsAB5EYN7",
  consumer_secret: "0L0iFn4L9vM7tdPRMGGWKtxKMsqn2X59jyYNb9QRiCqvvEJXU9",
  access_token_key: "1771153890085343232-sOwkJQqh3hCLRpf4dLEhxsx9OOWbjK",
  access_token_secret: "I4Ws8HF3fd7T5aJyitiSr4d0xx3tmt20yg1MIFEioRUmo",
});

exports.postTweet = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { tweet } = req.body;
      const user = req.user.uid;
      const userData = await admin
        .firestore()
        .collection("Users")
        .doc(user)
        .get();
      const twitterToken = userData.data().twitterToken;

      const tweetResponse = await twitterClient.post(
        "statuses/update",
        { status: tweet },
        {
          oauth: {
            token: twitterToken.oauthToken,
            token_secret: twitterToken.oauthTokenSecret,
          },
        }
      );

      // Set CORS headers in the response
      res.set("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
      res.set("Access-Control-Allow-Methods", "POST"); // Allow only POST requests
      res.set("Access-Control-Allow-Headers", "Content-Type"); // Allow only requests with Content-Type header
      res.status(200).json({ success: true, tweetId: tweetResponse.id_str });
    } catch (error) {
      console.error("Error posting tweet:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
});
