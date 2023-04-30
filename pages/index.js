import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from "react"



export default function Home() {

  let session = useSession()
  if (session.data) {
    return (
      <>
        Signed in as {session.data.user.name} <br />
        <button onClick={() => signOut('twitter')}>Sign out</button>
      </>
    )
  } else {
    return (
      <>
        Not signed in <br />
        <button onClick={() => '' + signIn('twitter')}>Sign in</button>
      </>
    )
  }
}
