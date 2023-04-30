import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useEffect } from "react"

export default function Home() {

  let session = useSession()
  if (session.data) {
    return (
      <>
        Signed in as {session.data.email} <br />
        <button onClick={() => signOut('credentials')}>Sign out</button>
      </>
    )
  } else {
    return (
      <>
        Not signed in <br />
        <Link href="/login">Login</Link>
      </>
    )
  }
}
