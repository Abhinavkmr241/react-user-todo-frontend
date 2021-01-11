import { ADD_USERDATA, REMOVE_USERDATA } from '../actions';

const userData = {
    token: ''
}

export const userDataReducer = (
    state = userData,
    action
) => {
    let newState = { ...state };
    switch (action.type) {
        case ADD_USERDATA: {
            newState = {
                token: action.payload.user.token
            }
            break;
        }

        case REMOVE_USERDATA: {
            newState = {
                token: ''
            }
            break;
        }
        default: {
        }
    }
    return newState;
}
