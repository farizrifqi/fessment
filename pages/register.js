import { useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
export default function registerPage() {

   
    return (
        <>

            <div
                className="min-h-screen min-w-screen">
                <div className="flex flex-col ">
                    <div className="md:flex md:flex-row h-screen md:items-center justify-around">
                        <div className="w-1/2 md:flex hidden flex-col items-center h-screen md:bg-[url('/assets/images/open-door.png')] bg-center bg-no-repeat">

                        </div>
                        <div className="flex flex-col justify-center items-center bg-white shadow-lg rounded-md md:w-1/2 h-full">
                            <div className="w-1/2 flex flex-col justify-center items-center gap-4">
                                <strong className="text-3xl uppercase mb-4 block tracking-wide">Register</strong>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter Your Email"
                                    className="border px-3 py-2 text-gray-500 w-full shadow appearance-none focus:outline-none"
                                    name="email"
                                ></input>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="New Password"
                                    className="border px-3 py-2 text-gray-500 w-full shadow appearance-none focus:outline-none"
                                ></input>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Re-enter New Password"
                                    className="border px-3 py-2 text-gray-500 w-full shadow appearance-none focus:outline-none"
                                ></input>
                                <button className="text-white block bg-sky-500 p-3 w-full font-medium">Sign up</button>
                                <div className="flex flex-row justify-end w-full">
                                    <a href="#" className="tracking-wide" >Already have an account?</a>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}