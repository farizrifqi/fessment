const API_URL = "https://api.twitter.com/2"
const response_format = {
    success: false,
}
export function FessmentTwitter() {

    return {
        async createTweet(token, message) {
            let request = await fetch(API_URL + '/tweets',
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ text: message })
                });
            let response = await request.json();
            return response
        },
        async createTweetWithMedia(token, message, media) {
            let request = await fetch(API_URL + '/tweets',
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ text: message, media: { "media_ids": media } })
                });
            let response = await request.json();
            return response
        },
        async getDirectMessages(token) {
            let request = await fetch(API_URL + '/dm_events?dm_event.fields=sender_id&expansions=attachments.media_keys&media.fields=media_key,preview_image_url,url,variants',
                {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
            let response = await request.json();
            return response
        },
        async refreshOAuthToken(refresh_token) {
            const BasicAuthToken = Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`, "utf8").toString(
                "base64"
            );
            let request = await fetch(API_URL + '/oauth2/token?grant_type=refresh_token&client_id=' + process.env.TWITTER_CLIENT_ID + '&refresh_token=' + refresh_token,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded",
                        "Authorization": `Basic ${BasicAuthToken}`
                    }
                });
            let response = await request.json();
            return response
        },
        async getAccessToken(code) {
            const BasicAuthToken = Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`, "utf8").toString(
                "base64"
            );
            let request = await fetch(API_URL + `/oauth2/token?client_id=${process.env.TWITTER_CLIENT_ID}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.NEXTAUTH_URL}/api/twitter/callback&code_verifier=8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        "Authorization": `Basic ${BasicAuthToken}`
                    }
                });
            let response = await request.json();
            return response;
        },
        async getSelfLookup(token) {
            let request = await fetch(API_URL + '/users/me?user.fields=profile_image_url',
                {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
            let response = await request.json();
            response_format.success = response.status ? false : true;
            if (response_format.success) {
                response_format.result = response;
            } else {
                response_format.message = response.title;
            }
            return response_format;
        }
    }
}