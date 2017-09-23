import reducer from '../reducers'
import { applyMiddleware, createStore } from 'redux'
import connector from '../middlewares/connector'
import socket from '../middlewares/socket'
import logger from '../middlewares/logger'
import sort from '../middlewares/sort'
import markRead from '../middlewares/markRead'

const store = createStore(
    reducer,
    applyMiddleware(markRead, connector, sort, logger, socket)
)

export const dispatch = store.dispatch
export const getState = store.getState
export default store