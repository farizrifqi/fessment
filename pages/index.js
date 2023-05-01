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
  }, [session])

  return (
    <>
      <div className="w-min-screen antialiased">
        <div className="flex flex-col">
          <div className="h-screen w-full flex flex-col justify-center items-center">

            <div className="flex flex-row w-1/4 justify-around">
              <Link href="register" className="inline-flex items-center justify-center m-2 bg-sky-500 px-4 py-2 focus:shadow-outline tracking-wide text-xl rounded hover:opacity-100 text-white w-full">Try it now!</Link>
              <Link href="login" className="inline-flex items-center justify-center m-2 border-sky-500  border-2 px-4 py-2 focus:shadow-outline tracking-wide text-xl rounded hover:opacity-100 text-gray-700 w-full">Login Area</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
