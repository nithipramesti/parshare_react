import { API_URL } from "../data/API";

function ProductCard(props) {
  let productData = props.productData;
  //{productData.image_product}

  return (
    <div className="product-card card">
      <img
        className="mt-4 mb-2"
        src={`${API_URL}/${productData.image_product}`}
        alt=""
        onClick={() => props.displayModal(productData)}
      />
      <div className="card-body">
        <p className="card-text mb-1 d-flex justify-content-between">
          <small className="text-muted">{productData.category}</small>
        </p>
        <h6
          className="card-title mb-3"
          onClick={() => props.displayModal(productData)}
        >
          {productData.product_name}
        </h6>

        <button
          onClick={() => props.addProduct(productData.id_product, props.index)}
          className="btn btn-outline-primary"
        >
          Add product
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
