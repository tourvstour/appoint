const storeNames = {
    person: [],
    service: [],
    loginStat: []
}

const reducer = (state = storeNames, action) => {
    switch (action.type) {
        case "person":
            return Object.assign({}, state, {
                person: state.person.concat(action.dataPerson)
            })
        case "claerPerson":
            return Object.assign({}, state, {
                person: []
            })
        case "ClearService":
            return Object.assign({}, state, {
                service: []
            })
        case "service":
            return Object.assign({}, state, {
                service: state.service.concat(action.dataService)
            })
        case "login":
            return Object.assign({}, state, {
                loginStat: state.loginStat.concat(action.logins)
            })
        default:
            return state
    }
}
export default reducer