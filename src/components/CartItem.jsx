import { API_URL } from "../data/API";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Axios from "axios";

function CartItem(props) {
  const cartItem = props.cartItem;

  //Create array to store products
  const productsArray = [];
  Object.keys(cartItem.products).forEach((val) => {
    productsArray.push(
      `${val} ${
        cartItem.products[val] > 1 ? `(${cartItem.products[val]})` : ""
      }`
    );
  });

  //Function to remove item from cart
  const removeCartItem = () => {
    Axios.patch(`${API_URL}/cart/delete`, {
      id_cart: cartItem.id_cart,
    })
      .then((res) => {
        console.log(res.data.message);

        //Refresh page
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <li className="list-group-item py-3">
      <div className="row g-0">
        <div className="col-md-2">
          <img
            src={`${API_URL}${cartItem.image_parcel}`}
            className="img-fluid rounded-start p-2"
            alt=""
          />
        </div>
        <div className="col-md-10 ps-2 d-flex justify-content-between">
          <div>
            <ul className="list-group list-group-flush">
              <div className="d-flex justify-content-between align-items-end">
                <h4 className="mt-3 mb-3">{cartItem.parcel_name}</h4>
                <div className="d-flex">
                  <p>
                    <strong>Rp {cartItem.parcel_price.toLocaleString()}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={removeCartItem}
                    className="btn-close remove-cart ms-3"
                    aria-label="Close"
                  ></button>
                </div>
              </div>
              <div className="parcel-products">
                <strong>Products:</strong>
                <p className="mb-1 cart-products text-muted">
                  {productsArray.join(", ")}
                </p>
                <Link
                  to={`/parcel/${cartItem.id_parcel}?id_cart=${cartItem.id_cart}`}
                  className="link-primary"
                >
                  Edit products
                </Link>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

export default CartItem;
