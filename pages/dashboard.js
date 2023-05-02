
import { useSession, signIn, signOut, getSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useEffect } from "react"

import Navbar from "@/components/Navbar"

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
                        <Navbar session={session} />
                        <div className="h-screen flex flex-col justify-center items-center bg-slate-900">

                        </div>
                    </div>
                </div>
            </>
        )
    }
}