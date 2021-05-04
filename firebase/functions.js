import { auth, FieldValue, firestore, getChatColl, getChatRef, getPostRef, getPubPostRef, getPubUserRef, getStorageDpPath, getStoragePostPath, getUserRef, storage } from './firebase'
import store from '../redux/store/app'
import { DUMMY_DATA, POST_VISIBILITY, PROFIILE_VISIBILITY } from '../components/CONSTANTS';

/**
 * Authentication Functions
 * All Firebase Auth functions are included here.
 */

// Sign Up function
export function signUp(name, email, pass, setError) {
    if (name.length == 0) {
        setError("Name is required")
        return
    }
    if (pass.length == 0) {
        setError("Password is required")
        return
    }
    auth.createUserWithEmailAndPassword(email, pass)
        .then((result) => {
            createUserInDatabase(result.user.uid, name || result.user.displayName || "NO NAME", result.user.email, pass);
            console.log("signup", result.user);
            setError(null)
        })
        .catch(error => setError(error.message));
}

// Sign in function
export function signIn(email, pass, setError) {
    auth.signInWithEmailAndPassword(email, pass)
        .then(result => {
            let userRef = getUserRef(result.user.uid)
            let username = result.user.email.substr(0,result.user.email.indexOf('@'))
            userRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Welcome Back!!");
                } else {
                    console.log("Opps! No data. Creating data...");
                    createUserInDatabase(result.user.uid, result.user.displayName || username || "Name Here", result.user.email, pass);
                }
            })
            setError(null)
        })
        .catch(error => {
            setError(error.message)
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
    let userRef = getUserRef(uid)
    let pubUserRef = getPubUserRef();

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

    batch.set(pubUserRef, {
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

export async function addPost(img, caption, visibility, uid, state) {

    let userRef = getUserRef(uid);
    let newPostRef = userRef.collection("posts").doc()
    let pid = newPostRef.id;
    let rootRef = storage.ref();

    let pubPostRef = getPubPostRef()

    let currentTime = Date.now();

    const response = await fetch(img);
    const blob = await response.blob();

    // store post in user/{uid}/posts/{pid}
    let fileRef = rootRef.child(getStoragePostPath(uid, pid));
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
                    time: currentTime,
                    visibility: visibility
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
        state(true)
    }).catch((err) => {
        console.log(err);
        state(true)
    })
}

// Currently only captiion change is allowrd. No Visibility Change

export function editPost(pid, data) {
    const { user } = store.getState();
    const uid = user.uid;

    const dummySetter = (data) => data;

    let postRef = getPostRef(uid, pid)
    postRef.update({
        caption: data.caption
    }).then(() => {
        setPostData(uid, pid, dummySetter, true)
        console.log("Updated post " + pid);
    }).catch((err) => console.log(err.message))
}

export function deletePost(pid) {
    const { user, allPosts } = store.getState();
    const uid = user.uid;
    let time = Date.now()

    let batch = firestore.batch();

    let postRef = getPostRef(uid, pid)
    let fileRef = storage.ref().child(getStoragePostPath(uid, pid))
    let userRef = getUserRef(uid)

    let pubPostRef = getPubPostRef()

    batch.update(pubPostRef, {
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

export function setPostData(uid, pid, setter, forceUpdate = false) {
    const getOption = {
        source : forceUpdate ? 'server' : 'cache'
    }

    let postRef = getPostRef(uid, pid);
    postRef.get(getOption).then((doc) => {
        console.log("Fetched pid:" + pid + ' from cache')
        let data = doc.data();
        data = {
            ...data,
            uid: uid,
            pid: pid
        }
        setter(data);
    }).catch((err) => {
        if (forceUpdate) {
            console.log(err.message)
            return
        }
        postRef.get().then((doc) => {
            if (doc.exists) {
                console.log("fetched pid: " + pid + " from server")
                let data = doc.data()
                data = {
                    ...data,
                    uid: uid,
                    pid: pid
                }
                setter(data)
            } else {
                console.log("Post " + pid + " does not have doc")
            }
        }).catch((err) => {
            console.log(err.message)
        })
    })
}



/**
 * Functions for Like
*/

export async function likePost(uid, pid, myuid, state) {
    const { allPosts } = store.getState();
    let batch = firestore.batch();
    let postRef = getPostRef(uid, pid)
    let pubPostRef = getPubPostRef()

    batch.update(postRef, {
        likes: FieldValue.arrayUnion(myuid)
    })

    batch.update(pubPostRef, {
        [pid + '.numLikes']: FieldValue.increment(1)
    })

    await batch.commit().then(async () => {
        console.log("liked" + pid)
        state(false)
    }).catch(err => {
        console.log(err.message)
        state(false)
    })
}

export async function unlikePost(uid, pid, myuid, state) {
    const { allPosts } = store.getState();
    let batch = firestore.batch();
    let postRef = getPostRef(uid, pid)
    let pubPostRef = getPubPostRef()

    batch.update(postRef, {
        likes: FieldValue.arrayRemove(myuid)
    })

    batch.update(pubPostRef, {
        [pid + '.numLikes']: FieldValue.increment(-1)
    })

    await batch.commit().then(async () => {
        console.log("Unliked" + pid)
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
    let myDocRef = getUserRef(user.uid)
    let userDocRef = getUserRef(uid)
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
    let myDocRef = getUserRef(user.uid)
    let userDocRef = getUserRef(uid)
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
    let myDocRef = getUserRef(user.uid)
    let userDocRef = getUserRef(uid)
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
    let myDocRef = getUserRef(user.uid)
    let userDocRef = getUserRef(uid)
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
    let myDocRef = getUserRef(user.uid)
    let userDocRef = getUserRef(uid)
    let currentTime = Date.now();
    let mycontent = "Accepted Follow Req of " + allUser[uid].username;
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
    let myDocRef = getUserRef(user.uid)
    let userDocRef = getUserRef(uid)
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

    let newChatRef = getChatColl().doc();
    let myRef = getUserRef(user.uid)
    let userRef = getUserRef(uid)
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
    let chatRef = getChatRef(chatId)
    await chatRef.update({
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
    let postRef = getPostRef(uid, pid)
    await postRef.update({
        comments: FieldValue.arrayUnion(data)
    }).then(() => {
        console.log("Comment uploaded");
    }).catch((err) => console.log(err.message))
    state(false);
}

// Update Profile of User
export async function updateProfile(data) {

    const { user } = store.getState();
    const uid = user.uid;

    if(data && data.dp){
        await updateDp(data.dp)
    }

    let userRef = getUserRef(uid)
    let pubUserRef = getPubUserRef()

    let time = Date.now();

    let batch = firestore.batch();
    batch.update(userRef, {
        name: data.name,
        about: data.about,
        vis: data.vis,
        activity: FieldValue.arrayUnion({ content: "Update Profile", time: time })
    });
    batch.update(pubUserRef, {
        [uid + '.name']: data.name || user.name,
        [uid + '.vis']: data.vis || user.vis,

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

    let storageRef = storage.ref().child(getStorageDpPath(uid));
    let userRef = getUserRef(uid)
    let publicUser = getPubUserRef()

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