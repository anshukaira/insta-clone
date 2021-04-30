import React, { useEffect, useState } from 'react'
import { auth } from '../firebase/firebase'

import LoggedIn from './LoggedIn'
import LoggedOut from './LoggedOut'
import { Text, View } from 'react-native'

function Main() {
    const [uid, setUid] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (_user) => {
            setLoading(true);
            if (_user) {
                console.log("Logged in as: ", _user.uid)
                setUid(_user.uid)
            } else {
                console.log("Logged Out User");
                setUid("")
            }
            setLoading(false);
        })

        return () => {
            console.log("Unsubscribing auth listner")
            unsubscribe()
        }
    }, [])

    // loading animation goes here probably
    if (loading) {
        return (
            <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 30 }}>MIRAI C</Text>
            </View>
        )
    }

    if (uid.length > 0) {
        return <LoggedIn uid={uid} />;
    }
    return <LoggedOut />;
}

export default Main
