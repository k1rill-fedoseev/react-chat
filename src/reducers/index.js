import { combineReducers } from 'redux'
import ui from './ui'
import db from './db'

export default combineReducers({db, ui})