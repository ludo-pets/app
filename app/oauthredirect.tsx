// app/oauthredirect.tsx
import { Redirect } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'

export default function OAuthRedirect() {
    useEffect(() => {
        WebBrowser.maybeCompleteAuthSession()
    }, [])

    return <Redirect href="/" />
}
