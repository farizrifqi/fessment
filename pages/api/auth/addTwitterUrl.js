import oauth from "oauth";
import { useCookies } from 'react-cookie';


function unixTimestamp() {
    return Math.floor(Date.now() / 1000)
}

// export default async function RequestToken(req, res) {
//     // const url = "https://api.twitter.com/oauth/request_token"
//     // const options = {
//     //     oauth_callback: encodeURI(process.env.NEXTAUTH_URL + "/api/twitter/callback"),
//     // }
//     // const p = new URLSearchParams(options).toString()
//     // let request = await fetch(url, {
//     //     method: "POST",
//     //     headers: {
//     //         "Content-Type": "application/x-www-form-urlencoded",
//     //         "Authorization": `OAuth oauth_consumer_key=${process.env.TWITTER_CONSUMER_KEY}, oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg", oauth_signature="oauth_signature", oauth_timestamp=${unixTimestamp()}, oauth_signature_method="HMAC-SHA1", oauth_version="1.0"`
//     //     }

//     // })
//     // let response = await request.json()
//     // console.log(response)
//     // return response

//     const oauthConsumer = new oauth.OAuth(
//         'https://twitter.com/oauth/request_token?oauth_callback=' + encodeURIComponent(process.env.NEXTAUTH_URL + "/api/twitter/callback"),
//         'https://twitter.com/oauth/access_token',
//         process.env.TWITTER_CONSUMER_KEY,
//         process.env.TWITTER_CONSUMER_SECRET,
//         '1.0A',
//         'http://127.0.0.1:3000/api/twitter/callback',
//         'HMAC-SHA1'
//     )
//     oauthConsumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
//         if (error) {
//             console.log(error)
//             return false;
//         }
//         let url = "https://api.twitter.com/oauth/authorize?oauth_token" + oauthToken
//         res.redirect(307, '/dasboard?oauth=' + oauthToken + '&oauthSecret=' + oauthTokenSecret).end()
//         return true
//     })
// }

export default function getTwitterOAuthURL(req, res) {
    const rootUrl = "https://twitter.com/i/oauth2/authorize"
    const options = {
        redirect_uri: process.env.NEXTAUTH_URL + "/api/twitter/callback",
        client_id: process.env.TWITTER_CLIENT_ID,
        state: "state",
        response_type: "code",
        code_challenge: "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8",
        code_challenge_method: "S256",
        scope: ["users.read", "tweet.read", "follows.read", "follows.write", "offline.access", "dm.read"].join(" "), // add/remove scopes as needed
    };
    const qs = new URLSearchParams(options).toString();
    res.redirect(307, `${rootUrl}?${qs}`).end()
}