// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const Twitter = require("twitter");

// admin.initializeApp();

// const twitterClient = new Twitter({
//   consumer_key: "GKO1n44lLg567MbtqWIeDCkSZ ",
//   consumer_secret: "0WQSD75mwTdQkQteZBt2CHiU9J3fcMCCYBX6j0UOj0Rw3yiVVl",
//   access_token_key: "1771153890085343232-NfXuP9eG6aTnDIAMx3pfiABIeuQOb2",
//   access_token_secret: "bBPdpU1xz2kBlaW78O62fEA0OERpJYMFaKpjoiJE5G2nF",
// });

// exports.postTweet = functions.https.onCall(async (data, context) => {
//   try {
//     const { tweet } = data;
//     const user = context.auth.uid;
//     const userData = await admin
//       .firestore()
//       .collection("users")
//       .doc(user)
//       .get();
//     const twitterToken = userData.data().twitterToken;

//     const tweetResponse = await twitterClient.post(
//       "statuses/update",
//       { status: tweet },
//       {
//         oauth: {
//           token: twitterToken.oauthToken,
//           token_secret: twitterToken.oauthTokenSecret,
//         },
//       }
//     );

//     return { success: true, tweetId: tweetResponse.id_str };
//   } catch (error) {
//     console.error("Error posting tweet:", error);
//     return { success: false, error: error.message };
//   }
// });
// index.js (Firebase Cloud Function)

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Twitter = require("twitter");

admin.initializeApp();

const twitterClient = new Twitter({
  consumer_key: functions.config().twitter.consumer_key,
  consumer_secret: functions.config().twitter.consumer_secret,
  access_token_key: functions.config().twitter.access_token_key,
  access_token_secret: functions.config().twitter.access_token_secret,
});

exports.postTweet = functions.https.onCall(async (data, context) => {
  try {
    const { tweet } = data;
    const user = context.auth.uid;
    const userData = await admin
      .firestore()
      .collection("users")
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

    return { success: true, tweetId: tweetResponse.id_str };
  } catch (error) {
    console.error("Error posting tweet:", error);
    return { success: false, error: error.message };
  }
});
