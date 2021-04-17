import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, set, unset } from '../redux/slices/userSlice'
import { auth } from '../firebase/firebase'

import LoggedIn from './LoggedIn'
import LoggedOut from './LoggedOut'
import { Text } from 'react-native'

function Main() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((_user) => {
            setLoading(true);
            if (_user) {
                console.log(_user)
                let userData = { uid: "testing" }
                dispatch(set(userData))
            } else {
                dispatch(unset())
                console.log("Logged Out User");
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
        return <Text> Loading </Text>;
    }

    if (user.uid) {
        return <LoggedIn />;
    }
    return <LoggedOut />;
}

export default Main
