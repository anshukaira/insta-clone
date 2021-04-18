import firebase from 'firebase';
import { encryptData } from '../encryption/data'
import { encryptPassword } from '../encryption/pass';
import { auth, firestore, storage } from './firebase'

/**
 * Authentication Functions
 * All Firebase Auth functions are included here.
 */

// Sign Up function
export function signUp(name, email, pass) {
    auth.createUserWithEmailAndPassword(email, pass)
        .then((result) => {
            createUserInDatabase(result.user.uid, name || result.user.displayName, result.user.email, pass);
            console.log("signup", result);
        })
        .catch(error => console.log(error.message));
}

// Sign in function
export function signIn(email, pass) {
    auth.signInWithEmailAndPassword(email, pass)
        .then(result => {
            firestore.collection("user").doc(result.user.uid).get().then((doc) => {
                if (doc.exists) {
                    console.log("Welcome Back!!");
                } else {
                    console.log("Opps! No data. Creating data...");
                    createUserInDatabase(result.user.uid, result.user.displayName || "MIRAI NAME", result.user.email, pass);
                }
            })
        })
        .catch(error => {
            console.log(error.message)
            signOut();
        });
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
    let batch = firestore.batch();
    let userRef = firestore.collection("users").doc(uid);
    let privateRef = userRef.collection("data").doc("private");
    let pubicRef = userRef.collection("data").doc("public");
    let protectedRef = userRef.collection("data").doc("protected");
    let postPublicRef = firestore.collection('posts').doc('public');
    let postProtectedRef = firestore.collection('posts').doc('protected');

    batch.set(privateRef, {
        email: encryptData(email),
        pass: encryptPassword(pass),
        chats: {},
        cposts: [],
        sposts: []
    }, { merge: true });

    batch.set(pubicRef, {
        name: name,
        npost: 0,
        nfollower: 0,
        nfollowing: 0,
        dp: "",
        about: "",
        del: false,
        vis: ""
    }, { merge: true });

    batch.set(protectedRef, {
        follower: [],
        following: []
    }, { merge: true })

    batch.set(postPublicRef, {
        [uid]: []
    }, { merge: true });

    batch.set(postProtectedRef, {
        [uid]: []
    }, { merge: true });

    batch.commit().then(() => console.log("Created Account!!")).catch((err) => console.log(error.message))
}



/**
 * Posts related Functions Here
 */

export function addPost(img, caption, visibility, uid) {

    if (visibility !== 'PRIVATE' && visibility !== 'PUBLIC' && visibility !== 'PROTECTED') {
        visibility = 'PRIVATE'
    }

    let newPostRef = firestore.collection('users').doc(uid).collection("posts").doc()
    let pid = newPostRef.id;
    let rootRef = storage.ref();
    // store post in user/{uid}/posts/{pid}
    let fileRef = rootRef.child('users/' + uid + '/posts/' + pid);
    fileRef.putString(img, 'data_url').then((snapshot) => {
        console.log("image uploaded with p_id: " + pid)
        snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log(downloadURL)
            newPostRef.set({
                caption: caption,
                vis: visibility,
                comments: {},
                url: downloadURL,
                likes: [],
                time: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true }).then(() => {
                console.log("Success uploading post data")
                if (visibility !== 'PRIVATE')
                    firestore.collection("posts").doc(visibility.toLowerCase()).update({
                        [uid]: firebase.firestore.FieldValue.arrayUnion(pid)
                    }).then(() => {
                        console.log('Updated Collection')
                    })
            })

        })
    }).catch((err) => {
        console.log(err);
        console.log("Opps found error. Deleting temporary docs");
        newPostRef.delete().then(() => {
            console.log("Deleted doc Scussfully");
        })
        fileRef.delete().then(() => {
            console.log("Deleted image Scussfully");
        })
    })
}