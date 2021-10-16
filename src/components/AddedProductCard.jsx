import { API_URL } from "../data/API";

export const AddedProductCard = (props) => {
  const product = props.productData;

  return (
    <div className="addedProducts mb-3">
      <img className="" src={`${API_URL}/${product.image_product}`} alt="" />
      <div className="product-detail">
        <div className="d-flex top justify-content-between">
          <h6 className="mb-1">{product.product_name}</h6>
          <button
            type="button"
            onClick={() => props.editQty(props.index, "remove")}
            className="btn-close ms-2"
            aria-label="Close"
          ></button>
        </div>

        <div className="d-flex justify-content-between align-items-end">
          <p className="mb-0">
            <small className="text-muted">{product.category}</small>
          </p>
          <div className="quantity d-flex align-items-center">
            <a
              onClick={() => props.editQty(props.index, "decrement")}
              className="fs-5 m-0"
            >
              -
            </a>
            <input
              type="number"
              value={product.selected}
              className="form-control quantity p-0 mx-2"
            />
            <a
              onClick={() => props.editQty(props.index, "increment")}
              className="fs-5 m-0"
            >
              +
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddedProductCard;
