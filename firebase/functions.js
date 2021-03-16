import { auth } from './firebase'

export const signUp = (email, pass) => {
    auth.createUserWithEmailAndPassword(email, pass)
        .then(result => {
            console.log(result);
        })
        .catch(error => console.error)
}

export const signIn = (email, pass) => {
    auth.signInWithEmailAndPassword(email, pass)
        .then(result => {
            console.log(result);
        })
        .catch(error => console.error)
}

export const signOut = () => {

}
