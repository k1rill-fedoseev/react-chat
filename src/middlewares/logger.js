import names from '../actions/names'

export default store => next => action => {
    console.groupCollapsed(`${names[action.type]}`)
    console.dir(action)
    next(action)
    console.dir(store.getState())
    console.groupEnd()
}