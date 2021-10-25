const INITIAL_STATE = {
  cart_qty: 0,
  carts : []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_CART":
      return { ...state, carts : action.payload, cart_qty: 1 };
    case "RESET_CART":
      return {...INITIAL_STATE};
    default:
      return state;
  }
};
