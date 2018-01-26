import Store from './store';
import {saveUser} from './actions';

export function getUserFromRedux() {
    let user = Store.getState().user;
    if (user) {
        return true;
    } else {
        return false
    }
}

export function setUserInRedux(user) {
    Store.dispatch(saveUser(user));
}