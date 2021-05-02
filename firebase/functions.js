import { auth, FieldValue, firestore, storage } from './firebase'
import store from '../redux/store/app'
import { addPost as addCachedPost } from '../redux/slices/cachedPosts'
import { DUMMY_DATA, POST_VISIBILITY, PROFIILE_VISIBILITY } from '../components/CONSTANTS';

/**
 * Authentication Functions
 * All Firebase Auth functions are included here.
 */

// TODO: ADD ACTIVITY in ALL

// Sign Up function
export function signUp(name, email, pass) {
    auth.createUserWithEmailAndPassword(email, pass)
        .then((result) => {
            createUserInDatabase(result.user.uid, name || result.user.displayName || "NO NAME", result.user.email, pass);
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
                    createUserInDatabase(result.user.uid, result.user.displayName || "NO NAME", result.user.email, pass);
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
        .catch((error) => console.log(error.message));
}

// Creating user in database using uid to store user account informations related to app
function createUserInDatabase(uid, name, email, pass) {
    let batch = firestore.batch();
    let userRef = firestore.collection("users").doc(uid);
    let pubRef = firestore.collection("public").doc("users");

    let visibility = PROFIILE_VISIBILITY.PUBLIC // default visibilty is PUBLIC while creating user
    let username = email.substring(0, email.indexOf('@'))

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
            delete: false,
            dp: '',
            username: username
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
    let userRef = firestore.collection('users').doc(uid);

    let pubPostRef;
    if (visibility === POST_VISIBILITY.PUBLIC) {
        pubPostRef = firestore.collection('public').doc('pubPosts')
    } else {
        pubPostRef = firestore.collection('public').doc('protPosts')
    }

    let currentTime = Date.now();

    const response = await fetch(img);
    const blob = await response.blob();

    // store post in user/{uid}/posts/{pid}
    let fileRef = rootRef.child('users/' + uid + '/posts/' + pid);
    fileRef.put(blob).then((snapshot) => {
        console.log("image uploaded with p_id: " + pid)
        snapshot.ref.getDownloadURL().then((downloadURL) => {
            let batch = firestore.batch();
            batch.set(newPostRef, {
                caption: caption,
                comments: [],
                url: downloadURL,
                likes: [],
                time: currentTime
            }, { merge: true })

            batch.update(pubPostRef, {
                [pid]: {
                    uid: uid,
                    numLikes: 0,
                    time: currentTime
                }
            })
            batch.update(userRef, {
                ['activity']: FieldValue.arrayUnion({ content: 'Uploaded New Post ' + pid, time: currentTime })
            })
            batch.commit().then(() => {
                console.log("Post uploaded successfully to the database")
            }).catch((error) => {
                console.log("Error in doc update", error.message)
                fileRef.delete();
            })
        })
    }).catch((err) => {
        console.log(err);
    })
}

// Currently only captiion change is allowrd. No Visibility Change

export function editPost(pid, data) {
    const { user } = store.getState();
    const uid = user.uid;

    firestore.collection('users').doc(uid).collection('posts').doc(pid).update({
        caption: data.caption
    }).then(() => {
        updateCachedPosts(pid, true)
        console.log("Updated post " + pid);
    }).catch((err) => console.log(err.message))
}

export function deletePost(pid) {
    const { user, allPosts } = store.getState();
    const uid = user.uid;
    let time = Date.now()

    let batch = firestore.batch();

    let postRef = firestore.collection('users').doc(uid).collection('posts').doc(pid)
    let fileRef = storage.ref().child('users/' + uid + '/posts/' + pid)
    let userRef = firestore.collection('users').doc(uid)

    let postPublicRef
    if (allPosts[pid] && allPosts[pid].visibility == POST_VISIBILITY.PUBLIC) {
        postPublicRef = firestore.collection('public').doc('pubPosts')
    } else {
        postPublicRef = firestore.collection('public').doc('protPosts')
    }

    batch.update(postPublicRef, {
        [pid]: FieldValue.delete()
    })

    batch.update(userRef, {
        ['activity']: FieldValue.arrayUnion({ content: 'Deleted post ' + pid, time: time })
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
    if (!allPosts || !allPosts[pid]) {
        console.log("No Post related to pid: " + pid);
        return;
    }
    console.log(pid)
    let uid = allPosts[pid].uid;

    if (cachedPosts[pid]) {
        shouldFetch = false;
    }

    if (forceUpdate || shouldFetch) {
        store.dispatch(addCachedPost({ key: pid, content: { loaded: true } }))
        await firestore.collection("users").doc(uid).collection("posts").doc(pid).get().then((doc) => {
            if (doc.exists) {
                console.log("updating cachedPost" + pid)
                let docData = doc.data()
                let data = {
                    key: pid,
                    content: { ...docData, uid: uid, loaded: true }
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
    const { allPosts } = store.getState();
    let batch = firestore.batch();
    let postRef = firestore.collection("users").doc(uid).collection("posts").doc(pid);
    let pubPostRef;
    if (allPosts[pid].visibility == POST_VISIBILITY.PUBLIC) {
        pubPostRef = firestore.collection('public').doc('pubPosts');
    } else {
        pubPostRef = firestore.collection('public').doc('protPosts');
    }

    batch.update(postRef, {
        likes: FieldValue.arrayUnion(myuid)
    })

    batch.update(pubPostRef, {
        [pid + '.numLikes']: FieldValue.increment(1)
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
    const { allPosts } = store.getState();
    let batch = firestore.batch();
    let postRef = firestore.collection("users").doc(uid).collection("posts").doc(pid);
    let pubPostRef;
    if (allPosts[pid].visibility == POST_VISIBILITY.PUBLIC) {
        pubPostRef = firestore.collection('public').doc('pubPosts');
    } else {
        pubPostRef = firestore.collection('public').doc('protPosts');
    }
    batch.update(postRef, {
        likes: FieldValue.arrayRemove(myuid)
    })
    batch.update(pubPostRef, {
        [pid + '.numLikes']: FieldValue.increment(-1)
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
    const { user, allUser } = store.getState();
    let time = Date.now()
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    batch.update(myDocRef, {
        following: FieldValue.arrayUnion(uid),
        activity: FieldValue.arrayUnion({ content: 'You started Following ' + allUser[uid].username, time: time })
    })
    batch.update(userDocRef, {
        followers: FieldValue.arrayUnion(user.uid),
        activity: FieldValue.arrayUnion({ content: allUser[user.uid].username + ' started Following You', time: time })
    })

    batch.commit().then(() => console.log("Now Following user")).catch((err) => console.log(err.message))
}

export function unfollowUser(uid) {
    let time = Date.now()
    const { user, allUser } = store.getState();
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    batch.update(myDocRef, {
        following: FieldValue.arrayRemove(uid),
        activity: FieldValue.arrayUnion({ content: 'You unfollowed ' + allUser[uid].username, time: time })
    })
    batch.update(userDocRef, {
        followers: FieldValue.arrayRemove(user.uid),
        activity: FieldValue.arrayUnion({ content: allUser[user.uid].username + ' unfollowed You', time: time })
    })

    batch.commit().then(() => console.log("Now Unfollowing user")).catch((err) => console.log(err.message))
}

export function unsendFollowReq(uid) {
    const { user } = store.getState();
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    batch.update(myDocRef, {
        pendingReq: FieldValue.arrayRemove(uid)
    })
    batch.update(userDocRef, {
        followReq: FieldValue.arrayRemove(user.uid)
    })

    batch.commit().then(() => console.log("Unsend Follow Req")).catch((err) => console.log(err.message))
}

export function sendFollowReq(uid) {
    const { user } = store.getState();
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    batch.update(myDocRef, {
        pendingReq: FieldValue.arrayUnion(uid)
    })
    batch.update(userDocRef, {
        followReq: FieldValue.arrayUnion(user.uid)
    })

    batch.commit().then(() => console.log("Send Follow Req")).catch((err) => console.log(err.message))
}

export function acceptFollowReq(uid) {
    const { user, allUser } = store.getState();
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    let currentTime = Date.now();
    let mycontent = "Accepted Follow Req of " + allUser[uid];
    let usercontent = allUser[user.uid].username + " accepted your follow req";
    batch.update(myDocRef, {
        followReq: FieldValue.arrayRemove(uid),
        followers: FieldValue.arrayUnion(uid),
        activity: FieldValue.arrayUnion({ content: mycontent, time: currentTime })
    })
    batch.update(userDocRef, {
        pendingReq: FieldValue.arrayRemove(user.uid),
        following: FieldValue.arrayUnion(user.uid),
        activity: FieldValue.arrayUnion({ content: usercontent, time: currentTime })
    })

    batch.commit().then(() => console.log("Aceepted Follow Req")).catch((err) => console.log(err.message))
}

export function rejectFollowReq(uid) {
    const { user, allUser } = store.getState();
    let currentTime = Date.now();
    let mycontent = "Rejected Follow Req of " + allUser[uid].username;
    let usercontent = allUser[user.uid].username + " rejected your follow req";
    let batch = firestore.batch();
    let myDocRef = firestore.collection("users").doc(user.uid);
    let userDocRef = firestore.collection("users").doc(uid);
    batch.update(myDocRef, {
        followReq: FieldValue.arrayRemove(uid),
        activity: FieldValue.arrayUnion({ content: mycontent, time: currentTime })
    })
    batch.update(userDocRef, {
        pendingReq: FieldValue.arrayRemove(user.uid),
        activity: FieldValue.arrayUnion({ content: usercontent, time: currentTime })
    })

    batch.commit().then(() => console.log("Aceepted Follow Req")).catch((err) => console.log(err.message))
}


// Methods for Chats

export async function initiateChat(uid) {

    const { user, allUser } = store.getState();
    const time = Date.now()

    let newChatRef = firestore.collection("chats").doc();
    let myRef = firestore.collection("users").doc(user.uid);
    let userRef = firestore.collection("users").doc(uid);
    let chatId = newChatRef.id;

    let batch = firestore.batch();
    batch.set(newChatRef, {
        subscribed: [uid, user.uid]
    }, { merge: true })
    batch.update(myRef, {
        ['chats.' + uid]: chatId,
        'activity': FieldValue.arrayUnion({ content: 'Initiated Chat With ' + allUser[uid].username, time: time })
    })
    batch.update(userRef, {
        ['chats.' + user.uid]: chatId,
        'activity': FieldValue.arrayUnion({ content: 'Initiated Chat With ' + allUser[user.uid].username, time: time })
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
    await firestore.collection('chats').doc(chatId).update({
        [user.uid + '.' + time]: {
            ...data
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
        comments: FieldValue.arrayUnion(data)
    }).then(() => {
        console.log("Comment uploaded");
    }).catch((err) => console.log(err.message))
    state(false);
}

// Update Profile of User
export function updateProfile(data) {

    const { user } = store.getState();
    const uid = user.uid;

    let userRef = firestore.collection('users').doc(uid);
    let publicUser = firestore.collection('public').doc('users');

    let time = Date.now();

    let batch = firestore.batch();
    batch.update(userRef, {
        ...data,
        activity: FieldValue.arrayUnion({ content: "Update Profile", time: time })
    });
    batch.update(publicUser, {
        [uid]: {
            name: data.name,
            vis: data.visibility,
        }
    })
    batch.commit().then(() => {
        console.log("Profile Updated")
    }).catch((error) => {
        console.log(error.message);
    })
}

// update Dp
export async function updateDp(img) {

    const response = await fetch(img);
    const blob = await response.blob();

    const { user } = store.getState();
    const uid = user.uid

    let time = Date.now()

    let storageRef = storage.ref().child('users/' + uid + '/' + uid);
    let userRef = firestore.collection('users').doc(uid)
    let publicUser = firestore.collection('public').doc('users');

    storageRef.put(blob).then((snapshot) => {
        console.log("Dp Uploaded");
        snapshot.ref.getDownloadURL().then((downloadURL) => {
            let batch = firestore.batch();
            batch.update(userRef, {
                ['dp']: downloadURL,
                ['activity']: { content: 'DP Updated', time: time }
            })
            batch.update(publicUser, {
                [uid + '.dp']: downloadURL
            })
            batch.commit().then(() => {
                console.log("Dp updated in database")
            }).catch((error) => {
                console.log("Error Writing in database. Deleting file")
                storageRef.delete()
            })
        })
    }).catch((error) => console.log(error.message))
}