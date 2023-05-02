
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import { getTwitterOAuthURL } from '../lib/twitter'
import { toast } from "react-toastify"
import Image from 'next/image'

import Link from 'next/link'
import messagehandler from "../lib/toast"
import Navbar from "@/components/Navbar"

export default function DashboardPage() {

    const [twitterlists, setTwitterLists] = useState([])

    let { data: session, status } = useSession()

    let router = useRouter()
    let { type, action, message } = router.query

    const getTwitterAccounts = () => {
        fetch('/api/twitter/getUserTwitterAccounts').then(
            response => {
                response.json().then(
                    result => {
                        setTwitterLists(result)
                    }
                )
            }
        )
    }
    const addAccountTwitter = () => {
        router.push('/api/auth/addTwitterUrl')
    }
    const deleteAccount = async (id) => {
        console.log(id)
        let request = await fetch('/api/twitter/deleteTwitterAccount/' + id)
        let response = await request.json()
        if (response.success) {
            toast("Account successfully removed. ", { hideProgressBar: true, autoClose: 1000, type: "success" })
        } else {
            toast("Failed to remove account.", { hideProgressBar: true, autoClose: 1000, type: "warning" })
        }
        getTwitterAccounts()
    }

    useEffect(() => {
        if (!session && status != 'loading') {
            router.push('/');
        }
        if (type && (action || message)) {
            if (action) {
                toast(messagehandler()[type].addtwitter, { hideProgressBar: true, autoClose: 1000, type: type })
            } else {
                toast(message, { hideProgressBar: true, autoClose: 1000, type: type })
            }
        }
        getTwitterAccounts()

    }, [session, status])

    if (session) {
        return (
            <>
                <div className="w-min-screen antialiased">
                    <div className="flex flex-col">

                        <div className="h-screen flex flex-col justify-start items-center bg-slate-900">
                            <Navbar session={session} />
                            <div className="w-1/2 m-10">
                                <button className="text-white bg-sky-500 rounded px-2 py-1" onClick={addAccountTwitter}><i className="fa fa-plus"></i> Add Account</button>
                                <hr className="w-full h-px bg-slate-800 border-0 rounded md:my-3 dark:bg-gray-700" />
                                <div className={`grid ${twitterlists.length == 0 ? '' : 'grid-cols-2'} text-white w-full justify-center`}>
                                    {
                                        twitterlists.map((twitter, i) => (
                                            <div key={i} className="w-full px-2">
                                                <div className="w-full bg-slate-800 rounded-lg p-4 flex flex-col items-center gap-5">
                                                    <Image
                                                        src={twitter.image}
                                                        alt={twitter.username}
                                                        className="border-2 border-slate-700 rounded-full"
                                                        width={50}
                                                        height={50}
                                                    />
                                                    <div className="flex flex-col w-full items-center">
                                                        <h4 className="text-2xl font-bold tracking-tight text-white">{twitter.name}</h4>
                                                        <h5 className="text-xl tracking-tight text-slate-600 "><i className="fab fa-twitter text-sm"></i> {twitter.username}</h5>
                                                        <div className="flex flex-row gap-3 justify-center w-full mt-2">
                                                            <h5 className="text-sm tracking-tight text-slate-900 "><i className="fa fa-key text-sm"></i> {twitter.trigger}</h5>
                                                            <h5 className="text-sm tracking-tight text-slate-900 "><i className="fa fa-clock text-sm"></i> {twitter.trigger}</h5>
                                                        </div>

                                                    </div>
                                                    <div className="flex flex-row w-full items-center justify-between">
                                                        <div className="flex flex-row gap-2 items-center">
                                                            <button className="text-sm px-2 py-1 rounded bg-green-400"><i className="fa fa-refresh mr-1"></i> Sync</button>
                                                            <button className="text-sm px-2 py-1 rounded bg-sky-400"><i className="fa fa-pencil mr-1"></i> Trigger</button>
                                                            {/* <div className="py-1 text-slate-900 border-slate-900 border rounded text-sm px-2">
                                                                <i className="fa fa-key text-sm"></i> <span className="font-bold">{twitter.trigger}</span>
                                                            </div> */}
                                                        </div>
                                                        <button className="text-sm px-2 py-1 rounded bg-slate-700" onClick={() => (deleteAccount(twitter.id))}><i className=" fa fa-trash"></i> Remove</button>

                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                {/* <table className="table-auto text-white border-collapse border border-slate-500 w-full">
                                    <thead>
                                        <tr>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Trigger</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            twitterlists.length == 0 ? <div className="text-white">No account added yet.</div>
                                                : twitterlists.map((twitter, i) => (
                                                    <tr>
                                                        <td>{twitter.username}</td>
                                                        <td>{twitter.owner_email}</td>
                                                        <td>{twitter.trigger}</td>
                                                        <td className="align-center"><button><i className="fa fa-trash"></i></button></td>
                                                    </tr>
                                                ))
                                        }
                                    </tbody>
                                </table> */}

                            </div>
                        </div>
                    </div >
                </div >
            </>
        )
    }
}