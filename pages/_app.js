import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head'
import { CookiesProvider } from 'react-cookie';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Fessment</title>
      </Head>
      <CookiesProvider>
        <SessionProvider session={pageProps.session}>

          <Component {...pageProps} />
          <ToastContainer />

        </SessionProvider>
      </CookiesProvider>
    </>
  )
}
