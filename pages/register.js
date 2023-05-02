import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from 'next/router'
import { useSession, getSession } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
    let router = useRouter()
    let { data: session } = useSession()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [repass, setPass] = useState({ pass: '', rePass: '' })

    const validatePass = (p, r) => {
        setPass({ pass: p, rePass: r })
    }
    const handleSetEmail = (e) => {
        setEmail(e.target.value)
    }
    const handleSetName = (e) => {
        setName(e.target.value)
    }
    function validateEmail(input) {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return (!input.match(validRegex))

    }
    const validateForm = () => {
        if (repass.pass != repass.rePass) {
            toast('Password did not match!', { hideProgressBar: true, autoClose: 1500, type: 'warning' })
            return false;
        }
        if (repass.pass.length < 5) {
            toast('Password must be 5 digits!', { hideProgressBar: true, autoClose: 1500, type: 'warning' })
            return false
        }
        if (validateEmail(email)) {
            toast('Email invalid!', { hideProgressBar: true, autoClose: 1500, type: 'warning' })
            return false;
        }
        if (name == '' || email == '' || repass.pass == '') {
            toast('All fields are required.', { hideProgressBar: true, autoClose: 1500, type: 'warning' })
            return false;
        }
        return true
    }
    const signUp = async () => {
        let continueSignUp = validateForm()
        if (continueSignUp) {
            const resp = await fetch("/api/auth/create", {
                method: "POST",
                body: JSON.stringify({ email: email, password: repass.pass, name: name }),
            });
            let result = await resp.json()
            if (result.success) {
                toast('Successfully created', { hideProgressBar: true, autoClose: 2000, type: 'success' })
                router.push('/')

            } else {
                toast(result.message, { hideProgressBar: true, autoClose: 2000, type: 'warning' })
            }
        }
    }

    useEffect(() => {
        if (session) {
            router.push('/')
        }
    }, [])

    return (
        <>
            <div
                className="min-h-screen min-w-screen">
                <div className="flex flex-col ">
                    <div className="md:flex md:flex-row h-screen md:items-center justify-around">
                        <div className="w-1/2 md:flex hidden flex-col items-center h-screen md:bg-[url('/assets/images/fill-form.png')] bg-center bg-no-repeat">

                        </div>
                        <div className="flex flex-col justify-center items-center bg-white shadow-lg rounded-md md:w-1/2 h-full">
                            <div className="w-1/2 flex flex-col justify-center items-center gap-2">
                                <strong className="text-3xl uppercase md:mb-4 block tracking-wide">Register</strong>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Full Name"
                                    className="border px-3 py-2 text-gray-500 w-full shadow appearance-none focus:outline-none rounded"
                                    name="email"
                                    value={name}
                                    onChange={handleSetName}
                                ></input>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter Your Email"
                                    className="border px-3 py-2 text-gray-500 w-full shadow appearance-none focus:outline-none rounded"
                                    name="email"
                                    value={email}
                                    onChange={handleSetEmail}
                                ></input>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="New Password"
                                    className={`border px-3 py-2 text-gray-500 w-full shadow appearance-none focus:outline-none rounded`}
                                    value={repass.pass}
                                    onChange={e => validatePass(e.target.value, repass.rePass)}

                                ></input>
                                <input
                                    id="repassword"
                                    type="password"
                                    placeholder="Re-enter New Password"
                                    className={`border px-3 py-2 text-gray-500 w-full shadow appearance-none ${repass.pass == repass.rePass || repass.rePass == '' ? '' : 'border-red-500'} focus:outline-none rounded`}
                                    value={repass.rePass}
                                    onChange={e => validatePass(repass.pass, e.target.value)}
                                ></input>
                                <button className="text-white block bg-sky-500 p-3 w-full font-medium disabled:bg-sky-700" onClick={signUp}
                                    disabled={repass.pass == '' || repass.rePass == '' || email == '' || name == ''}
                                >Sign up</button>
                                <div className="flex flex-row justify-between w-full">
                                    <Link href="/" className="tracking-wide" >Back to Homepage</Link>
                                    <Link href="login" className="tracking-wide" >Already have an account?</Link>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )

}