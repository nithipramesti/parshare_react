export const AddedProductCard = (props) => {
  const product = props.productData;
  return (
    <div className="addedProducts mb-2">
      <img className="" src={product.image_product} alt="" />
      <div className="product-detail">
        <h6 className="mb-1">{product.product_name}</h6>
        <p className="mb-0">
          <small className="text-muted">{product.category}</small>
        </p>
        <p>{product.selected}</p>
      </div>
    </div>
  );
};

export default AddedProductCard;
