import objectAssign from 'object-assign';

export default function test(state = {}, action = {}) {
    switch (action.type) {
        case 'SAVE_USER':
            return objectAssign({}, state, {user: action.user});
        default:
            return state;
    }
}
