const INITIAL_STATE = {
  id_user: null,
  username: "",
  email: "",
  role: "",
  verified: "",
  gender: "",
  fullname: "",
  address: "",
  birthdate: "",
  pitcure_link: "",
  storageIsChecked: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, ...action.payload, storageIsChecked: true };
    case "USER_LOGOUT":
      return { ...INITIAL_STATE, storageIsChecked: true };
    case "CHECK_STORAGE":
      return { ...state, storageIsChecked: true };
    case "UPDATE_PROFILE":
      return { ...state,...action.payload, storageIsChecked: true };
    default:
      return state;
  }
};
