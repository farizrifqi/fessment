import { FessmentTwitter } from "../../../lib/twitter"

async function getDMS(req, res) {
    let token = "bVd3VEZPWU55TUZBWWZaR214YnU5QUZiNllwT09uRHZ4R1lrd0VLRlN0TnpROjE2ODMwNjEzODI3MjU6MToxOmF0OjE"
    let dms = await FessmentTwitter().getDirectMessages(token)
    console.log(dms.data[0], dms.includes.media)
    res.send("ea")
}

export default getDMS