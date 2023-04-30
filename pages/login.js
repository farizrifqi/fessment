import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from 'next/router'
import { getServerSession, signIn, useSession } from "next-auth/react";
import Link from "next/link";
export default function LoginPage() {
    let router = useRouter()
    let { data: session } = useSession()


    const [email, setEmail] = useState("farizrifqi26@gmail.com")
    const [password, setPassword] = useState("123123")

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const login = async () => {
        const res = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password,
            callbackUrl: process.env.NEXTAUTH_URL
        })
        if (res.ok) {
            toast('Successfully logged in.', { hideProgressBar: true, autoClose: 2000, type: 'success' })
            router.push('/')
        } else {
            toast(res.error, { hideProgressBar: true, autoClose: 2000, type: 'warning' })
        }
    }
    if (!session) {
        return (
            <>

                <div
                    className="min-h-screen min-w-screen">
                    <div className="flex flex-col ">
                        <div className="md:flex md:flex-row h-screen md:items-center justify-around">
                            <div className="flex flex-col justify-center items-center bg-white shadow-lg rounded-md md:w-1/2 h-full">
                                <div className="w-1/2 flex flex-col justify-center items-center gap-2">
                                    <strong className="text-3xl uppercase md:mb-4 block tracking-wide">Log in</strong>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter Email"
                                        className="border px-3 py-2 text-gray-500 w-full shadow appearance-none focus:outline-none rounded"
                                        name="email"
                                        value={email}
                                        onChange={handleEmailChange}

                                    ></input>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className={`border px-3 py-2 text-gray-500 w-full shadow appearance-none focus:outline-none rounded`}
                                        value={password}
                                        onChange={handlePasswordChange}
                                    ></input>
                                    <button className="text-white block bg-sky-500 p-3 w-full font-medium disabled:bg-sky-700" onClick={login}

                                    >Sign in</button>
                                    <div className="flex flex-row justify-end w-full">
                                        <Link href="register" className="tracking-wide" >Register new account</Link>
                                    </div>
                                </div>

                            </div>
                            <div className="w-1/2 md:flex hidden flex-col items-center h-screen md:bg-[url('/assets/images/open-door.png')] bg-center bg-no-repeat">

                            </div>


                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        router.push('/')
    }
}