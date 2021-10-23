const INITIAL_STATE = {
  cart_qty: 0,
  id_parcel : null,
  id_cart : null,
  products : []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_CART":
      return { ...state, ...action.payload, cart_qty: 1 };
    case "RESET_CART":
      return {...INITIAL_STATE};
    default:
      return state;
  }
};
