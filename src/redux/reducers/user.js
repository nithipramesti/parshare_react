const init_state = {
    email : "",
    username : "",
    role: "",
    storageIsChecked: false,
}

const reducers = (state = init_state, action) => {
    switch (action.type){
        case "USER_LOGIN":
            return {...state,...action.payload, storageIsChecked : true}
            break
        default:
            return state;
            break
    }
}

export default reducers;