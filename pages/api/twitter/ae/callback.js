import { getSession } from "next-auth/react"
import { FessmentTwitter } from "../../../lib/twitter"
import { HarperDBAdapter } from '../../../lib/adapters/harperdb'

export default async function callback(req, res) {

    const session = getSession({ req })
    if (!req.query.code || !session) res.redirect(307, '/').end()

    let token = await FessmentTwitter().getAccessToken(req.query.code)
    if (token.error) res.redirect(307, '/').end()

    let userInfo = await FessmentTwitter().getSelfLookup(token.access_token)
    if (!userInfo.success) res.redirect(307, '/').end()

    let insert = await HarperDBAdapter().addTwitterAccounts(token, userInfo.result.data, session)
    if (!insert.success) res.send(insert.message)
    res.redirect(307, '/').end()

}