import firebase from 'firebase';
import { auth, firestore, storage } from './firebase'
import store from '../redux/store/app'
import { addPost as addCachedPost } from '../redux/slices/cachedPosts'
import { set as setUser } from '../redux/slices/userSlice'

/**
 * Authentication Functions
 * All Firebase Auth functions are included here.
 */

// TODO: ADD ACTIVITY in ALL

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

// Edit post. CUrrent it allows only caption to edit

export function editPost(pid, data) {
    const { user, cachedPosts } = store.getState();
    const uid = user.uid;
    let newData = {
        ...cachedPosts[pid]
    }
    delete newData.uid;
    if (data && data.caption) {
        newData.caption = data.caption
    }

    firestore.collection('users').doc(uid).collection('posts').doc(pid).update(newData).then(() => {
        updateCachedPosts(pid, true)
        console.log("Updated post " + pid);
    }).catch((err) => console.log(err.message))
}

export function deletePost(pid) {
    const { user, allPosts } = store.getState();
    const uid = user.uid;
    let batch = firestore.batch();
    let postRef = firestore.collection('users').doc(uid).collection('posts').doc(pid)
    let fileRef = storage.ref().child('users/' + uid + '/posts/' + pid)
    let postPublicRef
    if (allPosts[pid] && allPosts[pid].visibility == 'PUBLIC') {
        postPublicRef = firestore.collection('public').doc('pubPosts')
    } else {
        postPublicRef = firestore.collection('public').doc('protPosts')
    }
    batch.update(postPublicRef, {
        [pid]: firebase.firestore.FieldValue.delete()
    })
    batch.delete(postRef)
    batch.commit().then(() => {
        fileRef.delete().then(() => {
            console.log("File and post deleted successfully")
        })
    }).catch((error) => {
        console.log(error.message)
    })
}

// To help minimise calls to firebase we will store post data in our own cache

export async function updateCachedPosts(pid, forceUpdate = false) {
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
        await firestore.collection("users").doc(uid).collection("posts").doc(pid).get().then((doc) => {
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
 * Functions for Like
*/

export async function likePost(uid, pid, myuid, state) {
    let batch = firestore.batch();
    let postRef = firestore.collection("users").doc(uid).collection("posts").doc(pid);
    let pubPostRef = firestore.collection("public").doc("pubPosts");
    batch.update(postRef, {
        likes: firebase.firestore.FieldValue.arrayUnion(myuid)
    })
    batch.update(pubPostRef, {
        [pid + '.numLike']: firebase.firestore.FieldValue.increment(1)
    })
    await batch.commit().then(async () => {
        console.log("liked" + pid)
        await updateCachedPosts(pid, true)
        state(false)
    }).catch(err => {
        console.log(err.message)
        state(false)
    })
}

export async function unlikePost(uid, pid, myuid, state) {
    let batch = firestore.batch();
    let postRef = firestore.collection("users").doc(uid).collection("posts").doc(pid);
    let pubPostRef = firestore.collection("public").doc("pubPosts");
    batch.update(postRef, {
        likes: firebase.firestore.FieldValue.arrayRemove(myuid)
    })
    batch.update(pubPostRef, {
        [pid + '.numLike']: firebase.firestore.FieldValue.increment(-1)
    })
    await batch.commit().then(async () => {
        console.log("Unliked" + pid)
        await updateCachedPosts(pid, true)
        state(false)
    }).catch(err => {
        console.log(err.message)
        state(false)
    })
}



/**
 * Methods Related to Follow Requests
 */
export function followUser(uid) {
    const { user } = store.getState();
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    batch.update(myDocRef, {
        following: firebase.firestore.FieldValue.arrayUnion(uid)
    })
    batch.update(userDocRef, {
        followers: firebase.firestore.FieldValue.arrayUnion(user.uid)
    })

    batch.commit().then(() => console.log("Now Following user")).catch((err) => console.log(err.message))
}

export function unfollowUser(uid) {
    const { user } = store.getState();
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    batch.update(myDocRef, {
        following: firebase.firestore.FieldValue.arrayRemove(uid)
    })
    batch.update(userDocRef, {
        followers: firebase.firestore.FieldValue.arrayRemove(user.uid)
    })

    batch.commit().then(() => console.log("Now Unfollowing user")).catch((err) => console.log(err.message))
}

export function unsendFollowReq(uid) {
    const { user } = store.getState();
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    batch.update(myDocRef, {
        pendingReq: firebase.firestore.FieldValue.arrayRemove(uid)
    })
    batch.update(userDocRef, {
        followReq: firebase.firestore.FieldValue.arrayRemove(user.uid)
    })

    batch.commit().then(() => console.log("Unsend Follow Req")).catch((err) => console.log(err.message))
}

export function sendFollowReq(uid) {
    const { user } = store.getState();
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    batch.update(myDocRef, {
        pendingReq: firebase.firestore.FieldValue.arrayUnion(uid)
    })
    batch.update(userDocRef, {
        followReq: firebase.firestore.FieldValue.arrayUnion(user.uid)
    })

    batch.commit().then(() => console.log("Send Follow Req")).catch((err) => console.log(err.message))
}

export function acceptFollowReq(uid) {
    const { user } = store.getState();
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    let currentTime = Date.now();
    let mycontent = "Accepted Follow Req of " + uid;
    let usercontent = uid + " accepted your follow req";
    batch.update(myDocRef, {
        followReq: firebase.firestore.FieldValue.arrayRemove(uid),
        followers: firebase.firestore.FieldValue.arrayUnion(uid),
        activity: firebase.firestore.FieldValue.arrayUnion({ content: mycontent, time: currentTime })
    })
    batch.update(userDocRef, {
        pendingReq: firebase.firestore.FieldValue.arrayRemove(user.uid),
        following: firebase.firestore.FieldValue.arrayUnion(user.uid),
        activity: firebase.firestore.FieldValue.arrayUnion({ content: usercontent, time: currentTime })
    })

    batch.commit().then(() => console.log("Aceepted Follow Req")).catch((err) => console.log(err.message))
}

export function rejectFollowReq(uid) {
    const { user } = store.getState();
    let currentTime = Date.now();
    let mycontent = "Rejected Follow Req of " + uid;
    let usercontent = uid + " rejected your follow req";
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    batch.update(myDocRef, {
        followReq: firebase.firestore.FieldValue.arrayRemove(uid),
        activity: firebase.firestore.FieldValue.arrayUnion({ content: mycontent, time: currentTime })
    })
    batch.update(userDocRef, {
        pendingReq: firebase.firestore.FieldValue.arrayRemove(user.uid),
        activity: firebase.firestore.FieldValue.arrayUnion({ content: usercontent, time: currentTime })
    })

    batch.commit().then(() => console.log("Aceepted Follow Req")).catch((err) => console.log(err.message))
}


// Methods for Chats

export async function initiateChat(uid) {
    const { user } = store.getState()
    let newChatRef = firestore.collection("chats").doc();
    let myRef = firestore.collection("users").doc(user.uid);
    let userRef = firestore.collection("users").doc(uid);
    let chatId = newChatRef.id;
    let batch = firestore.batch();
    batch.set(newChatRef, {
        subscribed: [uid, user.uid]
    }, { merge: true })
    batch.update(myRef, {
        ['chats.' + uid]: chatId
    })
    batch.update(userRef, {
        ['chats.' + user.uid]: chatId
    })
    await batch.commit().then(() => console.log("Chat initiated with id: " + chatId)).catch((error) => {
        console.log(error.message);
        newChatRef.delete().then(() => {
            console.log("cleared chat doc");
        })
        chatId = null;
    })
    return chatId;
}

export async function addMessage(chatId, data, state) {
    let { user } = store.getState()
    let time = Date.now();
    let ccid = time + "_" + user.uid
    await firestore.collection('chats').doc(chatId).update({
        [ccid]: {
            ...data,
            time: time,
            uid: user.uid
        }
    }).then(() => {
        console.log("Chat Added");
    }).catch((error) => console.log(error.message))
    state(false)
}

//methods for comments
export async function addComment(uid, pid, comment, state) {
    let { user } = store.getState();
    let data = {
        time: Date.now(),
        uid: user.uid,
        content: comment
    }
    await firestore.collection('users').doc(uid).collection('posts').doc(pid).update({
        comments: firebase.firestore.FieldValue.arrayUnion(data)
    }).then(() => {
        console.log("Comment uploaded");
    }).catch((err) => console.log(err.message))
    state(false);
}