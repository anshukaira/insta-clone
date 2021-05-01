user
(redux & global)
(users/{uid})
name = string
email = email
password = string
about = string
dp = url (defalut = name first letter)
vis = 'PRIVATE' (default) | 'PROTECTED' | 'PUBLIC'
delete = boolean (default = false)
chats = {uid: chatId}
followReq = [uid]
followers = [uid]
following = [uid]
pendingReq = [uid]
saved = [pid]
activity = [{content: string,time: time (ms)}]

allUser
(redux & global)
(public/users)
uid:{name:string, vis: 'VIS_ENUM', delete, dp: url,username}

pubPosts
(redux & global)
(public/pubPosts)
pid:{numLikes: integer, time: time, uid: string}

protPosts
(redux & global)
(public/protPosts)
pid:{numLikes: integer, time: time, uid: string}

allPosts
(redux & global)
(local combine pub and prot)
pid:{numLikes: integer, time: time, uid: string, visibility: 'PUBLIC' | 'PROTECTED' }

post
(state & component)
(users/{uid}/posts/{pid})
caption: string
comments: [{content:string, time:time, uid:string}]
likes:[uid]
time: time,
url: url

chat
(state & component)
(chats/{chatId})
uid:{time:{content:string, toccid:{uid,time},type:'NORMAL'|'POST'|'REPLY'}} // Updated

cachedPosts
(redux & global)
(local)
caption: string
comments: [{content:string, time:time, uid:string}]
likes:[uid]
time: time,
url: url
uid: uid