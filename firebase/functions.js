import firebase from 'firebase';
import { auth, firestore, storage } from './firebase'
import store from '../redux/store/app'
import { addPost as addCachedPost } from '../redux/slices/cachedPosts'
import { set as setUser } from '../redux/slices/userSlice'

/**
 * Authentication Functions
 * All Firebase Auth functions are included here.
 */

// Sign Up function
export function signUp(name, email, pass) {
    auth.createUserWithEmailAndPassword(email, pass)
        .then((result) => {
            createUserInDatabase(result.user.uid, name || result.user.displayName, result.user.email, pass);
            console.log("signup", result.user);
        })
        .catch(error => console.log(error.message));
}

// Sign in function
export function signIn(email, pass) {
    auth.signInWithEmailAndPassword(email, pass)
        .then(result => {
            firestore.collection("users").doc(result.user.uid).get().then((doc) => {
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
    let pubRef = firestore.collection("public").doc("users");

    let visibility = 'PRIVATE'

    batch.set(userRef, {
        name: name,
        email: email,
        password: pass,
        dp: "",
        about: "",
        delete: false,
        vis: visibility,
        followers: [],
        following: [],
        followReq: [],
        pendingReq: [],
        activity: [{ time: Date.now(), content: "Account Created" }],
        chats: {},
        saved: []
    }, { merge: true })

    batch.set(pubRef, {
        [uid]: {
            name: name,
            vis: visibility,
            delete: false
        }
    }, { merge: true })

    batch.commit().then(() => console.log("Created Account!!")).catch((err) => console.log(err.message))
}



/**
 * Posts related Functions Here
 */

export async function addPost(img, caption, visibility, uid) {

    let newPostRef = firestore.collection('users').doc(uid).collection("posts").doc()
    let pid = newPostRef.id;
    let rootRef = storage.ref();
    let currentTime = Date.now();

    const response = await fetch(img);
    const blob = await response.blob();

    // store post in user/{uid}/posts/{pid}
    let fileRef = rootRef.child('users/' + uid + '/posts/' + pid);
    fileRef.put(blob).then((snapshot) => {
        console.log("image uploaded with p_id: " + pid)
        snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log(downloadURL)
            newPostRef.set({
                caption: caption,
                comments: [],
                url: downloadURL,
                likes: [],
                time: currentTime
            }, { merge: true }).then(() => {
                let toBeAdded = {
                    uid: uid,
                    numLike: 0,
                    numComments: 0,
                    time: currentTime
                }
                console.log("Success uploading post data")
                if (visibility === 'PUBLIC') {
                    firestore.collection("public").doc("pubPosts").update({
                        [pid]: toBeAdded
                    }).then(() => {
                        console.log('Updated Collection')
                    })
                } else if (visibility === 'PROTECTED') {
                    firestore.collection("public").doc("protPosts").update({
                        [pid]: toBeAdded
                    }).then(() => {
                        console.log('Updated Collection')
                    })
                }
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
        let toBeAdded = {
            uid: uid,
            numLike: 0,
            numComments: 0,
            time: currentTime
        }
        if (visibility == 'PUBLIC') {
            firestore.collection("public").doc("pubPosts").update({
                [pid]: toBeAdded
            }).then(() => {
                console.log('Deleted from Collection')
            })
        } else if (visibility == 'PROTECTED') {
            firestore.collection("public").doc("protPosts").update({
                [pid]: toBeAdded
            }).then(() => {
                console.log('Deleted Collection')
            })
        }
    })
}


export function updateCachedPosts(pid, forceUpdate = false) {
    const { cachedPosts, allPosts } = store.getState();
    let shouldFetch = true;
    if (!allPosts[pid]) {
        console.log("No Post related to pid: " + pid);
        return;
    }
    let uid = allPosts[pid].uid;

    if (cachedPosts[pid]) {
        shouldFetch = false;
    }

    if (forceUpdate || shouldFetch) {
        store.dispatch(addCachedPost({ key: pid, content: {} }))
        firestore.collection("users").doc(uid).collection("posts").doc(pid).get().then((doc) => {
            if (doc.exists) {
                console.log("updating cachedPost" + pid)
                let docData = doc.data()
                let data = {
                    key: pid,
                    content: { ...docData, uid: uid }
                }
                store.dispatch(addCachedPost(data));
            } else {
                console.log(pid + " does not exists");
            }
        }).catch(err => console.log(err.message))
    } else {
        console.log(pid + " already present in cache");
    }
}



/**
 * Actions functions like [Like,Comment]
*/

export async function likePost(uid, pid, myuid) {
    let batch = firestore.batch();
    let postRef = firestore.collection("users").doc(uid).collection("posts").doc(pid);
    let pubPostRef = firestore.collection("public").doc("pubPosts");
    batch.update(postRef, {
        likes: firebase.firestore.FieldValue.arrayUnion(myuid)
    })
    batch.update(pubPostRef, {
        [pid + '.numlikes']: firebase.firestore.FieldValue.increment(1)
    })
    batch.commit().then(() => console.log("Liked" + pid)).catch(err => console.log(err.message))
}

export async function unlikePost(uid, pid, myuid) {
    let batch = firestore.batch();
    let postRef = firestore.collection("users").doc(uid).collection("posts").doc(pid);
    let pubPostRef = firestore.collection("public").doc("pubPosts");
    batch.update(postRef, {
        likes: firebase.firestore.FieldValue.arrayRemove(myuid)
    })
    batch.update(pubPostRef, {
        [pid + '.numlikes']: firebase.firestore.FieldValue.increment(-1)
    })
    batch.commit().then(() => console.log("Unliked" + pid)).catch(err => console.log(err.message))
}



export async function setUserStateFromFirebase(uid) {
    await firestore.collection("users").doc(uid).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            let state = {
                uid: uid,
                ...data
            }
            store.dispatch(setUser(state))
        } else {
            console.log("user data doen't exists")
        }
    })
}