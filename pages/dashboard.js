
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useEffect } from "react"


import Link from "next/link"

export default function DashboardPage() {
    let { data: session, status } = useSession()
    let router = useRouter()
    const signOutClick = () => {
        signOut()

    }
    useEffect(() => {
        if (!session && status != 'loading') {
            router.push('/');
        }
    }, [session, status])

    if (session) {
        return (
            <>

                <div className="w-min-screen antialiased">
                    <div className="flex flex-col">
                        <div
                            className="fixed w-full bg-slate-800">
                            <div className="m-5 flex flex-row justify-between items-center text-gray-100">
                                <div className="font-bold  tracking-wider text-3xl">
                                    <Link href='' className="text-white hover:opacity-100">FESSMENT.</Link>
                                </div>

                                <div className="flex flex-row gap-3">
                                    <Link href="#" className=" bg-slate-700 px-5 py-1 rounded hover:opacity-100 text-sm text-gray-200 font-medium">Dashboard</Link>
                                    <Link href="/manage" className=" bg-slate-700 px-5 py-1 rounded hover:opacity-100 text-sm text-gray-200 font-medium">Manage Accounts</Link>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <div className="text-white px-5 py-2 opacity-100 text-sm border rounded border-slate-700"><b>{session.email}</b> </div>
                                    <button onClick={signOutClick} className="text-white bg-slate-700 px-5 py-2 rounded opacity-100 text-sm "><i className="fa fa-power-off"></i></button>
                                </div>
                            </div>
                        </div>
                        <div className="h-screen flex flex-col justify-center items-center bg-slate-900">

                        </div>
                    </div>
                </div>
            </>
        )
    }
}