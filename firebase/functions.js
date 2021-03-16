import { encryptData } from '../encryption/data'
import { encryptPassword } from '../encryption/pass';
import { auth, firestore } from './firebase'


// Sign Up function
export const signUp = (name, email, pass) => {
    auth.createUserWithEmailAndPassword(email, pass)
        .then(result => {
            createUserInDatabase(result.user.name, name || result.users.name, result.user.email, pass);
            console.log(result);
        })
        .catch(error => console.error)
}

// Sign in function
export const signIn = (email, pass) => {
    auth.signInWithEmailAndPassword(email, pass)
        .then(result => {
            console.log(result);
        })
        .catch(error => console.error)
}

// Sign out function
export const signOut = () => {
    auth.signOut()
        .then(() => {
            console.log("Sign out successful")
        })
        .catch((error) => console.error)
}

// Creating user in database using uid to stro user account informations related to app
export const createUserInDatabase = (uid, name, email, pass) => {
    firestore.collection("users")
        .doc(uid)
        .set({
            name: encryptData(name),
            email: encryptData(email),
            pass: encryptPassword(pass)
        })
}
