import { FessmentTwitter } from "../../../lib/twitter"

async function getDMS(req, res) {
    let token = "MEtSY1Z6Yy0wekh4Ti1wY1hmVVdrbEY5TTNqZ2k1T2tDWjJwM3M1RmJEOFZrOjE2ODMxMzE1MDA4NTk6MToxOmF0OjE"
    let dms = await FessmentTwitter().getDirectMessages(token)
    console.log(dms.includes.users)
    let x = dms.includes.users.filter(u => u.id == "547529817")
    console.log(x[0])
    res.send("ea")
}
async function sendDMS(req, res) {
    let token = "bkJFVV9uWURVSU1OSDhOa2dLa3ZKS3g3MXdFSDRrTUtGcmJ6QXFmSzdNTjlhOjE2ODMxMzMwNDI1NzA6MToxOmF0OjE"
    let dms = await FessmentTwitter().sendDirectMessages(token, "547529817", "test")
    console.log(dms)
    res.send("ea")
}
export default sendDMS