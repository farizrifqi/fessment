import bcrypt from "bcryptjs"
import { HarperDBAdapter } from "@/lib/adapters/harperdb";

export default function createAccount(req, res) {
    switch (req.method) {
        case 'POST': {
            return createUser(req, res);
        }
        default: {
            return res.send("404");
        }

    }
}

async function createUser(req, res) {

    let data = JSON.parse(req.body)
    let checkEmail = await HarperDBAdapter().getUserByEmail(data.email)
    if (checkEmail) return res.json({ "success": false, "message": "Email already exists" })
    console.log(data.password)
    data.password = (await bcrypt.hash(data.password, 12))
    let createUser = await HarperDBAdapter().createUser(data)
    if (createUser) {
        return res.json({ "success": true, "message": "" })
    }


}
