import reducer from '../reducers'
import { createStore } from 'redux'

const store = createStore(reducer)

export const dispatch = store.dispatch
export const getState = store.getState
export default store