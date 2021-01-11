import { ADD_USERDATA, REMOVE_USERDATA } from './action-types';

export const addUser = (user) => {
    return {
        type: ADD_USERDATA,
        payload: user
    }
}

export const removeUser = () => {
    return {
        type: REMOVE_USERDATA
    }
}
