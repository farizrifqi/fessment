import { getSession } from "next-auth/react"
import { FessmentTwitter } from "../../../lib/twitter"
import { HarperDBAdapter } from '../../../lib/adapters/harperdb'


export default async function APITwitter(req, res) {
    switch (req.query.twitter[0]) {
        case "callback":
            let cb = await callback(req)
            if (cb.success) {
                res.redirect(307, '/dashboard?type=success&action=addaccount').end()
            } else {
                res.redirect(307, '/dashboard?type=warning&message=' + cb.message).end()
            }
            break;
        case "getUserTwitterAccounts":
            let accounts = await getUserTwitterAccounts(req)
            res.json(accounts)
            break;
        case "changeTrigger":
            let changeTr = await changeTriggers(req, req.query.twitter[1], req.query.twitter[2], req.query.twitter[3])
            // res.json(req.query)
            res.json(changeTr)
            break;
        case "deleteTwitterAccount":
            let deleteAcc = await deleteTwitterAccount(req, req.query.twitter[1])
            res.json({ success: deleteAcc })
            break;
        case "refreshToken":
            let accs = await refreshToken()
            res.json(accs)
            break;
        case "RunFessment":
            if (!req.query.twitter[1]) { res.json({ success: false, message: "No Trigger" }) }
            let runFess = await RunFessment(req.query.twitter[1])
            res.json(runFess)
            break;
        default:
            res.json(req.query)
            //res.redirect(307, '/').end()
            break;
    }
}

async function callback(req) {
    const session = await getSession({ req })

    if (!req.query.code || !session) return false
    let token = await FessmentTwitter().getAccessToken(req.query.code)
    if (token.error) return token

    let userInfo = await FessmentTwitter().getSelfLookup(token.access_token)
    if (!userInfo.success) return userInfo

    let insert = await HarperDBAdapter().addTwitterAccounts(token, userInfo.result.data, session.email)
    return insert
}

async function getUserTwitterAccounts(req) {
    const session = await getSession({ req })

    let response = await HarperDBAdapter().getTwitterAccountsByEmail(session.email)
    return response
}
async function getTwitterAccountById(id) {
    let response = await HarperDBAdapter().getTwitterAccountsById(id)
    return response
}
async function deleteTwitterAccount(req, id) {
    const session = await getSession({ req })
    if (!id || !session) return false
    let userInfo = await getTwitterAccountById(id)
    if (!userInfo[0]) return false
    if (userInfo[0].owner_email != session.email) return false
    let doDelete = await HarperDBAdapter().deleteTwitterAccounts(id)
    if (!doDelete.success) {
        return false
    }
    return true
}
async function changeTriggers(req, id, key, time) {
    const session = await getSession({ req })
    if (!id || !session) return false
    let userInfo = await getTwitterAccountById(id)
    if (!userInfo[0]) return false
    if (userInfo[0].owner_email != session.email) return false
    let changeTrig = await HarperDBAdapter().changeTrigger(id, key, time)
    return changeTrig
}
async function refreshToken() {
    let accs = await HarperDBAdapter().getTwitterAccounts()
    let totAcc = 0, success = 0, fail = 0
    for await (const acc of accs) {
        totAcc++
        let getToken = await FessmentTwitter().refreshOAuthToken(acc.refresh_token)
        if (getToken.access_token) {
            let update = await HarperDBAdapter().updateAccounts(acc.id, { access_token: getToken.access_token, refresh_token: getToken.refresh_token })
            success++
        } else {
            fail++
        }
    }
    return { totAcc: totAcc, success: success, fail: fail }
}
async function RunFessment(triggerTime) {
    let accs = await HarperDBAdapter().getTwitterAccounts()

    let success = 0, dupe = 0, fail = 0, image = 0, totAcc = 0
    accs.forEach(async (acc) => {
        totAcc++
        if (triggerTime != acc.triggerTime) return;
        let dms = await FessmentTwitter().getDirectMessages(acc.access_token)
        for await (const dm of dms.data) {
            if (dm.sender_id != acc.twitter_id) {
                if (dm.text.includes(acc.triggerKey)) {
                    let log = await HarperDBAdapter().findRunLog(dm.id)
                    if (!(log && log[0])) {
                        let sendTweet, text
                        if (dm.attachments) {
                            image++
                            return;
                            text = dm.text.split(" ")
                            text.pop()
                            text = text.join(" ")
                            sendTweet = await FessmentTwitter().createTweetWithMedia(acc.access_token, dm.text, dm.attachments.media_keys)
                            console.log(sendTweet)
                        } else {
                            text = dm.text
                            sendTweet = await FessmentTwitter().createTweet(acc.access_token, text)
                        }
                        console.log(sendTweet)
                        if (!sendTweet.data) {
                            fail++
                        } else {
                            success++
                        }
                        let sendLog = await HarperDBAdapter().addRunLog(acc.id, dm.sender_id, dm.text, sendTweet.data.id, dm.id, "success")

                    } else {
                        dupe++
                        console.log("pernah di post")
                    }
                }
            }
        }
    })
    return { totAcc: totAcc, success: success, fail: fail, dupe: dupe, image: image }
}