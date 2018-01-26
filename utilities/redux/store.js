import {createStore} from 'redux'
import Reducers from './reducers.js'

let store = createStore(Reducers);

export default store;