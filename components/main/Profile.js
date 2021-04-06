import React from 'react'
import { Button } from 'react-native'
import { signOut } from '../../firebase/functions'

function Profile() {
    return (
        <div>
            Profile
            <Button
                onPress={() => signOut()}
                title="Sign Out"
            />
        </div>
    )
}

export default Profile
