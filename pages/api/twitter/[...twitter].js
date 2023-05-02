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
            let changeTr = await changeTrigger(req, req.query.twitter[1], req.query.twitter[2])
            // res.json(req.query)
            res.json(changeTr)
            break;
        case "deleteTwitterAccount":
            let deleteAcc = await deleteTwitterAccount(req, req.query.twitter[1])
            res.json({ success: deleteAcc })
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
async function changeTrigger(req, id, key) {
    const session = await getSession({ req })
    if (!id || !session) return false
    let userInfo = await getTwitterAccountById(id)
    if (!userInfo[0]) return false
    if (userInfo[0].owner_email != session.email) return false
    let changeTrig = await HarperDBAdapter().changeTrigger(id, key)

    return changeTrig
}