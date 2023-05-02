import { HarperDBAdapter } from '../../../../lib/adapters/harperdb'
import { getSession } from "next-auth/react"

export default async function tests(req, res) {
    // const session = await getSession({ req })
    let x = await HarperDBAdapter().getTwitterAccountsByEmail("farizrifqi26@gmail.com")
    console.log(x)
    // console.log(session)
    res.send("ha")
}