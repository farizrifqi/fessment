import Loading from '../components/Loading'
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router'
import { useEffect } from "react"

export default function LoadingPage() {
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    let router = useRouter()

    let { oauth, oauthSecret } = router.query
    useEffect(() => {
        if (auth && oauthSecret) {
            setCookie('oauth_token', oauth, {
                path: '/',
            });
            setCookie('oauth_token_secret', oauthSecret, {
                path: '/',
            });
            router.push('/dashboard')
        } else {
            router.push('/dashboard')
        }
    }, [cookies]);
    return <Loading />
}