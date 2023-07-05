export default function getTwitterOAuthURL(req, res) {
    const rootUrl = "https://twitter.com/i/oauth2/authorize"
    const options = {
        redirect_uri: process.env.NEXTAUTH_URL + "/api/twitter/callback",
        client_id: process.env.TWITTER_CLIENT_ID,
        state: "state",
        response_type: "code",
        code_challenge: "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8",
        code_challenge_method: "S256",
        scope: ["users.read", "tweet.write", "tweet.read", "follows.read", "follows.write", "offline.access", "dm.read", "dm.write"].join(" "), // add/remove scopes as needed
    };
    const qs = new URLSearchParams(options).toString();
    res.redirect(307, `${rootUrl}?${qs}`).end()
}