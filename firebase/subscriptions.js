import { getChatRef, getPostRef, getPubPostRef, getPubUserRef, getUserRef } from './firebase'
import store from '../redux/store/app'
import { set as setUser } from '../redux/slices/userSlice';
import { set as setAllUser } from '../redux/slices/allUserSlice';
import { set as setAllPosts } from '../redux/slices/allPostsSlice'


export function subUser(uid) {
    console.log("subscribing user " + uid)
    let userRef = getUserRef(uid)
    const unsubscribe = userRef.onSnapshot((doc) => {
        if (doc.exists) {
            console.log("Update in user " + uid + " database!! fetching new content!!");
            let data = {
                uid: uid,
                loaded: true,
                ...doc.data()
            }
            store.dispatch(setUser(data));
        } else {
            console.log("Opps! User doc down't exist")
        }
    })
    return unsubscribe;
}

export function subAllUser() {
    console.log("subscribing all users")
    let pubUserRef = getPubUserRef();
    const unsubscribe = pubUserRef.onSnapshot((doc) => {
        if (doc.exists) {
            console.log("Update in public users database!! fetching new content!!");
            let data = doc.data();
            data = {
                loaded: true,
                ...data
            }
            store.dispatch(setAllUser(data));

        } else {
            console.log("All User does not exists")
        }
    })
    return unsubscribe
}


export function subAllPosts() {
    console.log("subscribing all users")
    let pubPostRef = getPubPostRef();
    const unsubscribe = pubPostRef.onSnapshot((doc) => {
        if (doc.exists) {
            console.log("Update in public post database!! fetching new content!!");
            let data = doc.data();
            data = {
                loaded: true,
                ...data
            }
            store.dispatch(setAllPosts(data));

        } else {
            console.log("All Post does not exists")
        }
    })
    return unsubscribe
}


// only when post is open
export function subPost(uid, pid, setter) {
    console.log("subscribing post " + uid + " " + pid);
    let postRef = getPostRef(uid, pid)
    const unsubscribe = postRef.onSnapshot((doc) => {
        if (doc.exists) {
            console.log("Update in post " + pid + " database!! fetching new content!!");
            let data = {
                uid: uid,
                ...doc.data()
            }
            setter(data);

        } else {
            console.log("Post does not exists")
        }
    })
    return unsubscribe
}


export function subAnotherUser(uid, setter) {
    console.log("subscribing user " + uid)
    let userRef = getUserRef(uid)
    const unsubscribe = userRef.onSnapshot((doc) => {
        if (doc.exists) {
            console.log("Update in user " + uid + " database!! fetching new content!!");
            let data = {
                uid: uid,
                ...doc.data()
            }
            setter(data);
        } else {
            console.log("Opps! User doc don't exist")
        }
    })
    return unsubscribe;
}

export function subChat(chatId, setter) {
    console.log("subscribing chat: " + chatId);
    let chatRef = getChatRef(chatId)
    const unsubscribe = chatRef.onSnapshot((doc) => {
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