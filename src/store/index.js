import reducer from '../reducers'
import { applyMiddleware, createStore } from 'redux'
import connector from '../middlewares/connector'
import socket from '../middlewares/socket'
import logger from '../middlewares/logger'
import sort from '../middlewares/sort'
import markRead from '../middlewares/markRead'
import autoLoad from '../middlewares/autoLoad'
import cookie from '../middlewares/cookie'

const store = createStore(
    reducer,
    applyMiddleware(markRead, autoLoad, connector, sort, logger, cookie, socket)
)

export const dispatch = store.dispatch
export const getState = store.getState
export default store