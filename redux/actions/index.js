import firebase from 'firebase'
import { USER_STATE_CHANGE } from '../constants/index'

export function fetchUser(){
    return((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((s) => {
                if(s.exists){
                    dispatch({
                        type: USER_STATE_CHANGE,
                        currentUser: s.data() 
                    })
                }else{
                    console.log('User doesnt exist')
                }
            })
    })
}