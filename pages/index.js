import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect } from "react"
import { useRouter } from 'next/router'


export default function Home() {

  let router = useRouter()
  let { data: session } = useSession()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])


  return (
    <>
      <div className="w-min-screen antialiased">
        <div className="flex flex-col">
          <div className="h-screen w-full flex flex-col justify-center items-center bg-slate-900">
            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Confess your tweet</h1>
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">Here at Fessment we provide free menfess bot with simple management.</p>

            <div className="flex flex-row w-1/4 justify-around">
              <Link href="register" className="inline-flex items-center justify-center m-2 bg-sky-500 px-4 py-2 focus:shadow-outline tracking-wide text-xl rounded hover:opacity-100 text-white w-full">Try it now</Link>
              <Link href="login" className="inline-flex items-center justify-center m-2 bg-white px-4 py-2 focus:shadow-outline tracking-wide text-xl rounded hover:opacity-100 text-slate-900 w-full">Login Area</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
