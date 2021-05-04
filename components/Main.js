import React, { useEffect, useState } from 'react'

import { Image, View } from 'react-native'

import { auth, firestore } from '../firebase/firebase'
import { LOGO } from './CONSTANTS'
import Loading from './Helper/Loading'

import LoggedIn from './LoggedIn'
import LoggedOut from './LoggedOut'

function Main() {
    const [uid, setUid] = useState(null)
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (_user) => {
            setLoading(true)
            if (_user) {
                console.log("Logged in as: ", _user.uid)
                setUid(_user.uid)
            } else {
                console.log("Logged Out User");
                setUid("")
            }
            setLoading(false);
        })

        firestore.enablePersistence().catch((err) => console.log(err.message))
        
        return () => {
            console.log("Unsubscribing auth listner")
            unsubscribe()
        }
    }, [])

    if(loading){
        return (
            <Loading/>
        )
    }

    if (uid) {
        return <LoggedIn uid={uid} />;
    }
    return <LoggedOut />;
}

export default Main
