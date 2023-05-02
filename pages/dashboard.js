
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { toast } from "react-toastify"
import Image from 'next/image'
import messagehandler from "../lib/toast"
import Navbar from "@/components/Navbar"
export default function DashboardPage() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const [twitterlists, setTwitterLists] = useState([])
    const [editList, setEditList] = useState({})
    const [triggerKey, setNewTriggerKey] = useState({})
    const [triggerTime, setNewTriggerTime] = useState({})

    let { data: session, status } = useSession()

    let router = useRouter()
    let { type, action, message, oauth, oauthSecret } = router.query

    const getTwitterAccounts = () => {
        fetch('/api/twitter/getUserTwitterAccounts').then(
            response => {
                response.json().then(
                    result => {
                        setTwitterLists(result)
                        // setEditList(result.map(res => ({ res[id]: { edit: false } })))
                    }
                )
            }
        )
    }
    const addAccountTwitter = () => {
        router.push('/api/auth/addTwitterUrl')
    }
    const deleteAccount = async (id) => {
        let request = await fetch('/api/twitter/deleteTwitterAccount/' + id)
        let response = await request.json()
        if (response.success) {
            toast("Account successfully removed. ", { hideProgressBar: true, autoClose: 1000, type: "success" })
        } else {
            toast("Failed to remove account.", { hideProgressBar: true, autoClose: 1000, type: "warning" })
        }
        getTwitterAccounts()
    }
    const saveTrigger = async (id) => {
        let request = await fetch('/api/twitter/changeTrigger/' + id + '/' + triggerKey[id] + '/' + triggerTime[id])
        let response = await request.json()
        if (response) {
            toast("Successfully change trigger", { hideProgressBar: true, autoClose: 1000, type: "success" })
        } else {
            toast("Failed to change trigger.", { hideProgressBar: true, autoClose: 1000, type: "warning" })
        }
        editTrigger(id)
        getTwitterAccounts()
    }
    const editTrigger = (idx) => {
        if (Object.keys(triggerKey).length == 0) {
            let key = { ...triggerKey }
            key[idx] = key
            setNewTriggerTime(key)
        }
        let oldK = { ...editList }
        oldK[idx] = !oldK[idx]
        setEditList(oldK)
    }
    const changeSelectTrigerTime = (e, id) => {
        let trg = { ...triggerTime }
        trg[id] = e.target.value
        setNewTriggerTime(trg)
    }
    const changeInputTriggerKey = (e, id) => {
        let trg = { ...triggerKey }
        trg[id] = e.target.value
        setNewTriggerKey(trg)
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
        if (oauth && oauthSecret) {
            console.log(oauthSecret, oauth)
        }
        console.log(triggerKey)
        getTwitterAccounts()
    }, [session, status, triggerKey, triggerTime])
    if (session) {
        return (
            <>
                <div className="w-min-screen w-screen antialiased">
                    <div className="flex flex-col w-screen">

                        <div className="h-screen flex flex-col justify-start items-center bg-slate-900 w-screen">
                            <Navbar session={session} />
                            <div className="w-1/2 m-10 ">
                                <div className={`grid ${twitterlists.length == 0 ? 'grid-cols-1 md:grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}  text-white w-full justify-center gap-4`}>
                                    {
                                        (twitterlists.length > 0) ?
                                            twitterlists.map((twitter, i) => (
                                                <div key={i} className="w-full">
                                                    <div className="w-full bg-slate-800 rounded-lg p-5 flex flex-col items-center gap-5">
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
                                                                <h5 className="text-sm tracking-tight text-slate-900 "><i className="fa fa-key text-sm"></i> {twitter.triggerKey}</h5>
                                                                <h5 className="text-sm tracking-tight text-slate-900 "><i className="fa fa-clock text-sm"></i> {twitter.triggerTime}m</h5>
                                                            </div>

                                                        </div>
                                                        <div className="flex flex-row w-full items-center justify-between">
                                                            <div className="flex flex-row gap-2 items-center">
                                                                {

                                                                    (!editList[twitter.id]) ?
                                                                        <>
                                                                            <button className="text-sm px-4 py-2 rounded bg-green-700"><i className="fa fa-refresh "></i></button>
                                                                            <button onClick={() => (editTrigger(twitter.id, twitter.trigger))} className="text-sm px-4 py-2 rounded bg-sky-700"><i className="fa fa-cog"></i></button>
                                                                        </>
                                                                        :
                                                                        <div className="flex flex-row gap-2">
                                                                            <button onClick={() => (editTrigger(twitter.id, twitter.trigger))} className="px-2 text-sm border-2 rounded text-slate-600 border-slate-600 hover:bg-slate-900"><i className="text-sm fa fa-angle-left"></i></button>
                                                                            <input type="text" maxLength="7" onChange={(e) => (changeInputTriggerKey(e, twitter.id))} defaultValue={twitter.triggerKey} className="outline-none px-2 text-black py-1 text-sm tracking-widest font-bold rounded w-16"></input>
                                                                            <select defaultValue={twitter.triggerTime} onChange={(e) => (changeSelectTrigerTime(e, twitter.id))} className="outline-none px-2 text-black py-1 text-sm tracking-widest font-bold rounded w-16 hover:cursor-pointer">
                                                                                {
                                                                                    [15, 20, 30, 40].map((t, i) => (
                                                                                        <option key={i} value={t} className="font-medium" >{t}</option>
                                                                                    ))
                                                                                }

                                                                            </select>
                                                                            <button onClick={() => (saveTrigger(twitter.id))} className="px-2 text-sm border-2 rounded text-green-600 border-green-600 hover:bg-slate-900 h-full"><i className="fa fa-save"></i></button>
                                                                        </div>
                                                                }

                                                            </div>
                                                            <button className="text-sm px-4 py-2 rounded bg-slate-700" onClick={() => (deleteAccount(twitter.id))}><i className=" fa fa-trash"></i></button>

                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            :
                                            <></>
                                    }
                                    <div className="w-full">
                                        <button onClick={addAccountTwitter} className="w-full bg-slate-800 rounded-lg p-5 flex flex-col items-center justify-center gap-5 h-full hover:border-slate-600 border-slate-800 border-2">
                                            <div className="rounded-full bg-slate-700 px-5 py-4">
                                                <i className="fa fa-plus text-6xl text-slate-800"></i>
                                            </div>
                                            <h1 className="text-xl tracking-tight text-slate-600 font-medium ">Add Account</h1>
                                        </button>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div >
                </div >
            </>
        )
    }
}