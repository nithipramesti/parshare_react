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
  const cartReducer = useSelector((state) => state.cartReducer)

  //Dispatch
  const dispatch = useDispatch();

  const [cartRaw, setCartRaw] = useState([]);

  //State for saving cart products data
  const [cartItems, setCartItems] = useState([]);

  let transaction_totalprice = 0;

  cartItems.forEach((val) => {
    transaction_totalprice += val.parcel_price;
  });

  const renderCartItem = () => {
    console.log(`cartItems`, cartItems);
    console.log(`cartReducer`, cartReducer)
    console.log(``)

    return cartItems.map((val) => {
      return <CartItem cartItem={val}/>;
    });
  };

  const checkout = () => {
    const now = new Date();
    let transaction_date = date.format(now, "YYYY/MM/DD HH:mm:ss");

    //Get income:

    let income = 0;
    let parcels = [];

    cartRaw.forEach((cartItem) => {
      const indexFind = parcels.findIndex(
        (el) => el.id_parcel === cartItem.id_parcel
      );

      if (indexFind === -1) {
        parcels.push({
          id_parcel: cartItem.id_parcel,
          parcel_price: cartItem.parcel_price,
          products: [
            {
              id_product: cartItem.id_product,
              product_price: cartItem.product_price,
              product_quantity: cartItem.product_quantity,
            },
          ],
        });
      } else {
        parcels[indexFind].products.push({
          id_product: cartItem.id_product,
          product_price: cartItem.product_price,
          product_quantity: cartItem.product_quantity,
        });
      }
    });

    parcels.forEach((val) => {
      let productsTotalPrice = 0;

      val.products.forEach((product) => {
        productsTotalPrice += product.product_price * product.product_quantity;
      });

      income += val.parcel_price - productsTotalPrice;
    });

    Axios.post(`${API_URL}/cart/checkout`, {
      id_user: cartItems[0].id_user,
      transaction_date,
      transaction_totalprice,
      income,
      cartRaw,
    }).then((res) => {
      if (res.data.message) {
        alert(res.data.message);

        dispatch({
          type: "RESET_CART"
        });

        const emptyAr = [];
        setCartRaw([...emptyAr]);
        setCartItems([...emptyAr]);
      }
    });
  };

  useEffect(() => {
    console.log(`cartReducer`, cartReducer)
    Axios.post(`${API_URL}/cart/get`, {
      id_user: authReducer.id_user,
    }).then((res) => {
      setCartRaw(res.data.cartItems);

      let cartArray = [];

      res.data.cartItems.forEach((rawObj) => {
        let index = cartArray.findIndex((el) => el.id_cart === rawObj.id_cart);

        if (index === -1) {
          const {id_parcel, id_cart, id_user, parcel_name, parcel_price, image_parcel } =
            rawObj;

          let products = {};
          products[rawObj.product_name] = rawObj.product_quantity;

          cartArray.push({
            id_parcel,
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
