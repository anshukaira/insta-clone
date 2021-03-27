import { encryptData } from '../encryption/data'
import { encryptPassword } from '../encryption/pass';
import { auth, firestore } from './firebase'


// Sign Up function
export function signUp(name, email, pass) {
    auth.createUserWithEmailAndPassword(email, pass)
        .then(result => {
            createUserInDatabase(result.user.name, name || result.users.name, result.user.email, pass);
            console.log(result);
        })
        .catch(error => console.error);
}

// Sign in function
export function signIn(email, pass) {
    auth.signInWithEmailAndPassword(email, pass)
        .then(result => {
            console.log(result);
        })
        .catch(error => console.error);
}

// Sign out function
export function signOut() {
    auth.signOut()
        .then(() => {
            console.log("Sign out successful");
        })
        .catch((error) => console.error);
}

// Creating user in database using uid to store user account informations related to app
function createUserInDatabase(uid, name, email, pass) {
    firestore.collection("users")
        .doc(uid)
        .set({
            name: encryptData(name),
            email: encryptData(email),
            pass: encryptPassword(pass)
        });
}

// Get user account related info. Separate functions coz we give account details change functionality
export function getUserInfo(uid) {
    let userInfo = {}
    firestore.collection("users").doc(uid).get().then((doc) => {
        if (doc.exists) {
            userInfo = doc.data()
        } else {
            console.log("No such user in database!");
        }
    }).catch((error) => {
        console.log("Error getting user info:", error.message);
    });
    return userInfo
}
