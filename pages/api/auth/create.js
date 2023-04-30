import clientPromise from "@/lib/mongodb";
const ObjectId = require('mongodb').ObjectId;
import { useRouter } from 'next/router'


export default function createAccount(req, res) {
    switch (req.method) {
        case 'GET': {
            return createUser(req, res);
        }
        default: {
            return updatePost(req, res);
        }

    }
}

async function createUser(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("menfess");
        await db.collection('users').insertOne(JSON.parse(req.body));
        return res.json({
            message: JSON.parse(JSON.stringify(posts)),
            success: true,
        });
    } catch (error) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}
