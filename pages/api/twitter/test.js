import { FessmentTwitter } from "../../../lib/twitter"

async function getDMS(req, res) {
    let token = "NmZ2RFFjTDhDOEh5UUNrZEZPZzl0eWxobGh6T3Y5SXhpQ1NYcGhvWlUzWC1rOjE2ODMwMjM0MTkzMjA6MTowOmF0OjE"
    let dms = await FessmentTwitter().getDirectMessages(token)
    console.log(dms)
    res.send("ea")
}

export default getDMS