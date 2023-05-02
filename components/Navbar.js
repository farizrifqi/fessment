import { signOut } from "next-auth/react"
import { useRouter } from 'next/router';

import Link from "next/link"

export default function Navbar(props) {
    const session = props.session
    const router = useRouter()

    const signOutClick = () => {
        signOut()
    }
    const links = [
        {
            path: "/dashboard",
            name: "Dashboard"
        },
        {
            path: "/manage",
            name: "Manage Accounts"
        }
    ]

    if (session) {
        return (
            <div
                className="w-full bg-slate-800">
                <div className="m-5 flex flex-row justify-between items-center text-gray-100">
                    <div className="font-bold  tracking-wider text-3xl">
                        <Link href='' className="text-white hover:opacity-100">FESSMENT.</Link>
                    </div>

                    <div className="flex flex-row gap-3">
                        {
                            links.map((l, i) => (
                                <Link href={`${router.pathname == l.path ? "#" : l.path}`} key={i} className={`${router.pathname == l.path ? 'bg-slate-700' : 'bg-slate-600'} px-5 py-1 rounded hover:opacity-100 text-sm text-gray-200 font-medium `}>{l.name}</Link>
                            ))
                        }
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="text-white px-5 py-2 opacity-100 text-sm border rounded border-slate-700"><b>{session.email}</b> </div>
                        <button onClick={signOutClick} className="text-white bg-slate-700 px-5 py-2 rounded opacity-100 text-sm "><i className="fa fa-power-off"></i></button>
                    </div>
                </div>
            </div>
        )
    }
}