import { API_URL } from "../data/API";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CartItem(props) {
  const cartItem = props.cartItem;
  
  const cartReducer = useSelector((state) => state.cartReducer);
  
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
                <p>
                  <strong>Rp {cartItem.parcel_price}</strong>
                </p>
              </div>
              {/* <p className="mb-2">
              <small className="text-muted">
                3 Chocolate, 2 Snack, 1 Coffee
              </small>
            </p> */}
              <div className="parcel-products">
                <strong>Products:</strong>
                <p className="mb-1">
                  {Object.keys(cartItem.products).join(", ")}
                </p>
                <Link
                  to={`/parcel/${cartReducer.id_parcel}/${cartItem.id_cart}`}
                  className="link-primary"
                >
                  Edit products
                </Link>
              </div>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => props.editQty(props.index, "remove")}
            className="btn-close ms-2 ps-4 pt-3"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </li>
  );
}

export default CartItem;
