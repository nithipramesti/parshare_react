const INITIAL_STATE = {
  cart_qty: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case " ADD_CART":
      return { ...state, cart_qty: 1 };
    case " RESET_CART":
      return { ...state, cart_qty: 0 };
    default:
      return state;
  }
};
