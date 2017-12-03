import names from '../actions/names'

export default store => next => action => {
    if (process.env.NODE_ENV !== 'development') {
        next(action)
        return
    }
    console.groupCollapsed(`${names[action.type]}`)
    console.dir(action)
    next(action)
    console.dir(store.getState())
    console.groupEnd()
}