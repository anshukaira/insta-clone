import DummyDp from '../assets/dummy.jpeg'
import { Image, Platform } from 'react-native';

export const POST_VISIBILITY = {
    PUBLIC: 'PUBLIC',
    PROTECTED: 'PROTECTED'
}

export const PROFIILE_VISIBILITY = {
    PUBLIC: 'PUBLIC',
    PROTECTED: 'PROTECTED',
    PRIVATE: 'PRIVATE'
}

export const DUMMY_DATA = {
    email: 'dummy@gmail.com',
    uid: 'dummy12345',
    name: 'Dummy User',
    about: 'Hi! I am Dummy User',
    caption: 'This is dummy caption',
    message: 'This is dummy message',
    dp: Platform.OS == 'web' ? DummyDp : Image.resolveAssetSource(DummyDp).uri
}

export const CHAT_MESSAGE_TYPE = {
    NORMAL: 'NORMAL',
    REPLY: 'REPLY',
    POST: 'POST'
}