import React, { useEffect, useState } from 'react'
import { auth } from '../firebase/firebase'

import LoggedIn from './LoggedIn'
import LoggedOut from './LoggedOut'
import { Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, set as setUser, unset as unsetUser } from '../redux/slices/userSlice'

function Main() {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (_user) => {
            setLoading(true);
            if (_user) {
                console.log("Logged in as: ", _user.uid)
                dispatch(setUser({ uid: _user.uid }));
            } else {
                console.log("Logged Out User");
                dispatch(unsetUser());
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
