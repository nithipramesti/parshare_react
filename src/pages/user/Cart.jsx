import Axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/styles/user/cart.css";
import CartItem from "../../components/CartItem";
import { API_URL } from "../../data/API";
import date from "date-and-time";

function Cart() {
  //Global state
  const authReducer = useSelector((state) => state.authReducer);

  const [cartRaw, setCartRaw] = useState([]);

  //State for saving cart products data
  const [cartItems, setCartItems] = useState([]);

  let transaction_totalprice = 0;

  cartItems.forEach((val) => {
    transaction_totalprice += val.parcel_price;
  });

  const renderCartItem = () => {
    console.log(cartItems);

    return cartItems.map((val) => {
      return <CartItem cartItem={val} />;
    });
  };

  const checkout = () => {
    const now = new Date();
    let transaction_date = date.format(now, "YYYY/MM/DD HH:mm:ss");

    const income = 5000;

    Axios.post(`${API_URL}/cart/checkout`, {
      id_user: cartItems[0].id_user,
      transaction_date,
      transaction_totalprice,
      income,
      cartRaw,
    }).then((res) => {
      if (res.data.message) {
        alert(res.data.message);

        const emptyAr = [];
        setCartRaw([...emptyAr]);
        setCartItems([...emptyAr]);
      }
    });
  };

  useEffect(() => {
    Axios.post(`${API_URL}/cart/get`, {
      id_user: authReducer.id_user,
    }).then((res) => {
      setCartRaw(res.data.cartItems);

      let cartArray = [];

      res.data.cartItems.forEach((rawObj) => {
        let index = cartArray.findIndex((el) => el.id_cart === rawObj.id_cart);

        if (index === -1) {
          const { id_cart, id_user, parcel_name, parcel_price, image_parcel } =
            rawObj;

          let products = {};
          products[rawObj.product_name] = rawObj.product_quantity;

          cartArray.push({
            id_cart,
            id_user,
            parcel_name,
            parcel_price,
            image_parcel,
            products,
          });
        } else {
          cartArray[index].products[rawObj.product_name] =
            rawObj.product_quantity;
        }

        setCartItems([...cartArray]);
      });
    });
  }, []);

  return (
    <div className="cart">
      <h1 className="mb-5">Cart</h1>
      <div className="cart-parcels">
        <div className="card cart-parcel">
          <ul className="list-group list-group-flush">
            {cartItems[0] && renderCartItem()}
          </ul>
        </div>
        <div className="text-end mt-4">
          <div className="total-price">
            <strong>{`Rp ${transaction_totalprice.toLocaleString()}`}</strong>
          </div>
          <button className="btn btn-primary mt-3" onClick={checkout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
