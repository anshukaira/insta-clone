import { firestore } from './firebase'
import store from '../redux/store/app'
import { set as setUser } from '../redux/slices/userSlice';
import { set as setAllUser } from '../redux/slices/allUserSlice';
import { set as setPubPosts } from '../redux/slices/pubPostsSlice';
import { set as setProtPosts } from '../redux/slices/protPostsSlice';
import { addProtected, addPublic } from '../redux/slices/allPostsSlice';

/**
 * TODO: Make a global dict for storing all subscription and based on it check if need to subscribe or reuse existing one
*/

export function subUser(uid,) {
    console.log("subscribing user " + uid)
    const unsubscribe = firestore.collection("users").doc(uid)
        .onSnapshot((doc) => {
            if (doc.exists) {
                console.log("Update in user " + uid + " database!! fetching new content!!");
                let data = {
                    uid: uid,
                    ...doc.data()
                }
                store.dispatch(setUser(data));
            } else {
                console.log("Opps! User doc down't exist. cant subscribe")
            }
        })
    return unsubscribe;
}

export function subAllUser() {
    console.log("subscribing all users")
    const unsubscribe = firestore.collection("public").doc("users")
        .onSnapshot((doc) => {
            if (doc.exists) {
                console.log("Update in public users database!! fetching new content!!");
                let data = doc.data();
                store.dispatch(setAllUser(data));

            } else {
                console.log("pubPosts does not exists. Cant subscribe")
            }
        })
    return unsubscribe
}

export function subPublicPosts() {
    console.log("subscribing public posts")
    const unsubscribe = firestore.collection("public").doc("pubPosts")
        .onSnapshot((doc) => {
            if (doc.exists) {
                console.log("Update in public posts database!! fetching new content!!");
                let data = doc.data();
                store.dispatch(setPubPosts(data));
                store.dispatch(addPublic(data));

            } else {
                console.log("pubPosts does not exists. Cant subscribe")
            }
        })
    return unsubscribe
}

export function subProtPosts() {
    console.log("subscribing protected posts")
    const unsubscribe = firestore.collection("public").doc("protPosts")
        .onSnapshot((doc) => {
            if (doc.exists) {
                console.log("Update in public prot posts database!! fetching new content!!");
                let data = doc.data();
                store.dispatch(setProtPosts(data));
                store.dispatch(addProtected(data))

            } else {
                console.log("protPosts does not exists. Cant subscribe")
            }
        })
    return unsubscribe
}

// only when post is open
export function subPost(uid, pid, setter) {
    console.log("subscribing post " + uid + " " + pid);
    const unsubscribe = firestore.collection("users").doc(uid).collection("posts").doc(pid)
        .onSnapshot((doc) => {
            if (doc.exists) {
                console.log("Update in post " + pid + " database!! fetching new content!!");
                let data = {
                    uid: uid,
                    ...doc.data()
                }
                setter(data);

            } else {
                console.log("protPosts does not exists. Cant subscribe")
            }
        })
    return unsubscribe
}


export function subAnotherUser(uid, setter) {
    console.log("subscribing user " + uid)
    const unsubscribe = firestore.collection("users").doc(uid)
        .onSnapshot((doc) => {
            if (doc.exists) {
                console.log("Update in user " + uid + " database!! fetching new content!!");
                let data = {
                    uid: uid,
                    ...doc.data()
                }
                setter(data);
            } else {
                console.log("Opps! User doc down't exist. cant subscribe")
            }
        })
    return unsubscribe;
}

export function subChat(chatId, setter) {
    console.log("subscribing chat: " + chatId);
    const unsubscribe = firestore.collection("chats").doc(chatId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                console.log("Update in Chat: " + chatId);
                setter(doc.data())
            }
            else {
                console.log("Chat: " + chatId + " does not exists")
            }
        })
    return unsubscribe
}