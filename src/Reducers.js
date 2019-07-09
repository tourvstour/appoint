const storeNames = {
    person: [],
    service: []
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
        default:
            return state
    }
}
export default reducer