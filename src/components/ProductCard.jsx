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
      />
      <div className="card-body">
        <h6 className="card-title mb-1">{productData.product_name}</h6>
        <p className="card-text mb-2 d-flex justify-content-between">
          <small className="text-muted">{productData.category}</small>
          <small className="text-muted">
            {`Stock: ${productData.product_quantity}`}
          </small>
        </p>
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
