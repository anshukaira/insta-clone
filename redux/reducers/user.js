import { initializeApp } from "firebase"

const initialState = {
    currentUser: null
}

export const user = (state = initializeApp, action) => {
    return{
        ...state,
        currentUser: action.currentUser
    }
}