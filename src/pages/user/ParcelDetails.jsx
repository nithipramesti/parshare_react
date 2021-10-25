import "../../assets/styles/user/parcel-details.css";
import ProductCard from "../../components/ProductCard";
import { API_URL } from "../../data/API";
import { useEffect, useState } from "react";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AddedProductCard from "../../components/AddedProductCard";
import { Link } from "react-router-dom";

function ParcelDetails(props) {
  //Get id_parcel from route params
  const id_parcel = props.match.params.id_parcel;
  const id_cart = props.match.params.id_cart;

  //Dispatch
  const dispatch = useDispatch();

  //Global state
  const authReducer = useSelector((state) => state.authReducer);
  const cartReducer = useSelector((state) => state.cartReducer);

  //State for loading
  const [isLoading, setIsLoading] = useState(true);

  //State for saving parcel categories & qty
  const [parcelData, setParcelData] = useState({});

  //State for saving selected categories quantity
  const [selectedCategories, setSelectedCategories] = useState({});

  //State for saving products data
  const [products, setProducts] = useState([]);

  //State for pagination
  const [pagination, setPagination] = useState({
    page: 1,
    maxPage: 0,
    itemPerPage: 9,
  });

  //State for saving filtered products data
  const [filteredProducts, setFilteredProducts] = useState([]);

  //State for saving category filter
  const [filterCategory, setFilterCategory] = useState("All");

  //State for sorting
  const [sortBy, setSortBy] = useState("");

  //State for saving added products & quantity
  const [addedProducts, setAddedProducts] = useState([]);

  //State for product details modal
  const [modalToggle, setModalToggle] = useState({
    displayed: false,
    product: {},
  });

  //Function for pagination
  const paginationHandler = (direction) => {
    if (direction === "next") {
      if (pagination.page < pagination.maxPage) {
        setPagination({ ...pagination, page: pagination.page + 1 });
      }
    } else if (direction === "previous") {
      if (pagination.page > 0) {
        setPagination({ ...pagination, page: pagination.page - 1 });
      }
    }
  };

  //Render categories & quantity
  const renderCategories = () => {
    let categoriesString = [];
    let parcelCategories = Object.keys(parcelData.categories);

    parcelCategories.map((val) => {
      categoriesString.push(`${parcelData.categories[val]} ${val}`);
    });

    if (parcelCategories.length === 2) {
      return categoriesString.join(" & ");
    } else {
      return categoriesString.join(", ");
    }
  };

  //Function to change quantity of ADDED PRODUCT
  const editQty = (index, operator) => {
    //Create new var for saving added product data
    let addedProduct = addedProducts[index];

    //Check if category quantity will exceeded or not
    if (
      selectedCategories[addedProduct.category] <=
      parcelData.categories[addedProduct.category]
    ) {
      //decrement or increment
      if (operator === "increment") {
        //Increment only works if less than category quantity:
        if (
          selectedCategories[addedProduct.category] <
          parcelData.categories[addedProduct.category]
        ) {
          //Increment props selected in addedProduct
          addedProduct.selected += 1;

          //Increment selected category
          setSelectedCategories({
            ...selectedCategories,
            [addedProduct.category]:
              selectedCategories[addedProduct.category] + 1,
          });

          //Find addedProduct index in products
          let indexProduct = products.findIndex(
            (el) => el.id_product === addedProduct.id_product
          );

          //Decrement product stock:
          let ar = products;
          ar[indexProduct].product_quantity -= 1;
          setProducts([...ar]);
        }
      } else if (operator === "decrement") {
        //Decrement props selected in addedProduct
        addedProduct.selected -= 1;

        //Decrement selected category
        setSelectedCategories({
          ...selectedCategories,
          [addedProduct.category]:
            selectedCategories[addedProduct.category] - 1,
        });

        //Find addedProduct index in products
        let indexProduct = products.findIndex(
          (el) => el.id_product === addedProduct.id_product
        );

        //Increment product stock:
        let ar = products;
        ar[indexProduct].product_quantity += 1;
        setProducts([...ar]);
      } else if (operator === "remove") {
        //Change selected category quantity
        setSelectedCategories({
          ...selectedCategories,
          [addedProduct.category]:
            selectedCategories[addedProduct.category] - addedProduct.selected,
        });

        //Find addedProduct index in products
        let indexProduct = products.findIndex(
          (el) => el.id_product === addedProduct.id_product
        );

        //Reset product stock:
        let ar = products;
        ar[indexProduct].product_quantity += addedProduct.selected;
        setProducts([...ar]);

        //Set props selected in addedProduct to 0
        addedProduct.selected = 0;
      }
    }
  };

  //Function to add product
  const addProduct = (id_product) => {
    //Add selected product to state addedProducts:

    //Find index in addProducts
    const indexAddedProduct = addedProducts.findIndex(
      (el) => el.id_product === id_product
    );

    //Get product data with selected id_product
    let addedProduct = products.find((el) => el.id_product === id_product);

    if (indexAddedProduct === -1) {
      //If the product not added before:

      //Push product to addedProducts, with props selected = 0
      let ar = addedProducts;
      ar.push({ ...addedProduct, selected: 0 });
      setAddedProducts([...ar]);

      //Add product to addedProducts using function editQty
      editQty(addedProducts.length - 1, "increment");
    } else {
      //If its already added before:

      //Add product to addedProducts using function editQty
      editQty(indexAddedProduct, "increment");
    }

    console.log(selectedCategories);

    //exceeded category quantity ALERT

    //Increment selected product-category

    //Decrement selected product quantity in state (in database after transaction succeed)
  };

  //Function to add parcel to CART
  const addToCart = () => {
    //Get array of categories
    const categories = Object.keys(parcelData.categories);

    let cartReady = true;

    let loop = true;

    while (loop) {
      for (let i = 0; i < categories.length; i++) {
        if (
          selectedCategories[categories[i]] !==
          parcelData.categories[categories[i]]
        ) {
          //if quantity of the category not eligible
          cartReady = false;
          loop = false;
        }
      }

      loop = false;
    }

    if (authReducer.username) {
      if (cartReady) {
        Axios.post(`${API_URL}/cart/add`, {
          id_user: authReducer.id_user,
          id_parcel: id_parcel,
          products: addedProducts,
        }).then((res) => {
          alert("Parcel added to cart!");

          let cartArray = [];

          res.data.data.forEach((val) => {
            let index = cartArray.findIndex((el) => el.id_cart === val.id_cart);

            if (index === -1) {
              const {id_parcel, id_cart, id_user, parcel_name, parcel_price, image_parcel } =
                val;

              let products = {};
              products[val.product_name] = val.product_quantity;

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
              cartArray[index].products[val.product_name] =
                val.product_quantity;
            }

            // setCartItems([...cartArray]);
          });
          // Set global state
          dispatch({
            type: "ADD_CART",
            payload: cartArray
          });
        });
      } else {
        alert(`Please select ${renderCategories()}`);
      }
    } else {
      alert("Please login first");
    }
  };

  const editToCart = () => {
    //Get array of categories
    const categories = Object.keys(parcelData.categories);

    let cartReady = true;

    let loop = true;

    while (loop) {
      for (let i = 0; i < categories.length; i++) {
        if (
          selectedCategories[categories[i]] !==
          parcelData.categories[categories[i]]
        ) {
          //if quantity of the category not eligible
          cartReady = false;
          loop = false;
        }
      }

      loop = false;
    }

    if (authReducer.username) {
      if (cartReady) {
        Axios.patch(`${API_URL}/cart/edit`, {
          id_user: authReducer.id_user,
          id_cart: id_cart,
          id_parcel: id_parcel,
          products: addedProducts,
        }).then((res) => {
          alert("Success Edit");
        });
      } else {
        alert(`Please select ${renderCategories()}`);
      }
    } else {
      alert("Please login first");
    }
  };

  //Function to render product details
  const renderProductDetails = () => {
    if (modalToggle.displayed) {
      return (
        <div
          className={`details-bg ${!modalToggle.displayed && `modal`} m-0 p-0`}
          tabindex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalToggle.product.product_name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalToggle(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body d-flex">
                {/* <img
                  src={`${API_URL}/${modalToggle.product.image_product}`}
                  alt=""
                /> */}
                <div className="info-text">
                  <p>
                    <strong>Category: </strong> {modalToggle.product.category}
                  </p>
                  <p>
                    <strong>Description:</strong>
                    <br />
                    {modalToggle.product.description}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalToggle(false)}
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const displayModal = (product) => {
    setModalToggle({ displayed: true, product });
  };

  useEffect(() => {
    let arr = products;
    if (filterCategory !== "All") {
      arr = products.filter((val) => val.category === filterCategory);
      console.log("arr", arr);
    }
    setFilteredProducts([...arr]);
  }, [filterCategory]);

  //Render categories filter
  const renderCategoriesFilter = () => {
    let categoriesFilter = ["All", ...Object.keys(parcelData.categories)];
    return categoriesFilter.map((category) => {
      return (
        <button
          className={`btn p-2 rounded-pill ${
            filterCategory === category ? `btn-primary` : `btn-outline-primary`
          } category-active px-3 me-1`}
          onClick={() => setFilterCategory(category)}
        >{`${category}`}</button>
      );
    });
  };

  //Function for search input handler
  const searchInputHandler = (event) => {
    const searchResult = products.filter((val) => {
      return val.product_name.toLowerCase().includes(event.target.value);
    });

    setFilteredProducts([...searchResult]);
  };

  //Render product cards
  const renderProductCards = () => {
    const beginningIndex = (pagination.page - 1) * pagination.itemPerPage;
    let rawData = [...filteredProducts];

    const compareString = (a, b) => {
      if (a.product_name < b.product_name) {
        return -1;
      } else if (a.product_name > b.product_name) {
        return 1;
      } else {
        return 0;
      }
    };

    switch (sortBy) {
      case "az":
        rawData.sort(compareString);
        break;

      case "za":
        rawData.sort((a, b) => compareString(b, a));
        break;

      default:
        rawData = [...filteredProducts];
        break;
    }

    const currentData = rawData.slice(
      beginningIndex,
      beginningIndex + pagination.itemPerPage
    );

    return currentData.map((product, index) => {
      return (
        <ProductCard
          productData={product}
          addProduct={addProduct}
          index={index}
          displayModal={displayModal}
        />
      );
    });
  };

  //Render added product cards
  const renderAddedProductCards = () => {
    return addedProducts.map((product, index) => {
      if (product.selected > 0) {
        console.log(`product:`, product);
        return (
          <AddedProductCard
            productData={product}
            editQty={editQty}
            setAddedProducts={setAddedProducts}
            index={index}
          />
        );
      }
    });
  };

  //Fetching product data
  useEffect(() => {
    //Send request to backend
    Axios.get(`${API_URL}/products/get/${id_parcel}`)
      .then((res) => {
        if (!res.data.errMessage) {
          //Save categories & qty to state
          setParcelData(res.data.parcelData);

          //Save categories & qty to state
          setSelectedCategories(res.data.selectedCategories);

          //Save products data to state
          setProducts(res.data.products);

          //Save products data to filter state
          setFilteredProducts(res.data.products);

          //Set max page -- depends on products number
          const maxPage = Math.ceil(
            res.data.products.length / pagination.itemPerPage
          );
          setPagination({ ...pagination, maxPage });

          console.log("max page: ", maxPage);

          setIsLoading(false);
        } else {
          console.log(res.data.errMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="parcel-detail">
        <p>Loading products data...</p>
      </div>
    );
  } else {
    return (
      <div className="parcel-detail">
        <div className="mx-5 main">
          <nav className="breadcrumb-container" aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Parcels</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {parcelData.name}
              </li>
            </ol>
          </nav>
          <div className="row">
            <div className="parcel-info mb-3">
              {parcelData.name && <h1 className="mb-1">{parcelData.name}</h1>}
              <div className="sub-info">
                <p className="categories mb-2 text-muted">
                  {parcelData.categories && renderCategories()}
                </p>
                <div className="d-flex justify-content-between">
                  <p className="mb-0">
                    {parcelData.price && (
                      <strong>Rp {parcelData.price.toLocaleString()}</strong>
                    )}
                  </p>
                  <div className="search-filter d-flex align-items-center">
                    <input
                      type="email"
                      className="form-control pe-4"
                      name="searchInput"
                      onChange={searchInputHandler}
                      placeholder="Search product"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="bi bi-search search-icon"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-4 card p-0">
              <h5 className="card-header py-3">Added Products</h5>
              <div className="card-body">
                {addedProducts[0] ? (
                  renderAddedProductCards()
                ) : (
                  <p className="text-muted">Added products will appear here</p>
                )}
                {cartReducer.carts.length !== 0 ? (
                  <button className="btn btn-primary mt-3" onClick={editToCart}>
                    Edit Parcel to Cart
                  </button>
                ) : (
                  <button className="btn btn-primary mt-3" onClick={addToCart}>
                    Add Parcel to Cart
                  </button>
                )}
              </div>
            </div>
            <div className="col-8">
              <div className="filter-sort mb-3 d-flex justify-content-between">
                <div className="d-flex">{renderCategoriesFilter()}</div>
                <div className="sort-container d-flex align-items-center">
                  <span className="sort-title me-1">Sort by:</span>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="" selected>
                      None
                    </option>
                    <option value="az">A - Z</option>
                    <option value="za">Z - A</option>
                  </select>
                </div>
              </div>
              <div className="products-container">{renderProductCards()}</div>
            </div>
          </div>
          <nav
            className="pagination-container mt-4 ps-0 me-5 pe-5"
            aria-label="Page navigation example"
          >
            <ul className="pagination justify-content-end">
              <li
                className={`page-item ${
                  pagination.page === 1 ? `disabled` : ``
                }`}
              >
                <button
                  onClick={() => paginationHandler("previous")}
                  className="page-link"
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>
              <li className="page-item disabled" aria-current="page">
                <button className="page-link">{`${pagination.page} / ${pagination.maxPage}`}</button>
              </li>
              <li
                className={`page-item ${
                  pagination.page === pagination.maxPage ? `disabled` : ``
                }`}
              >
                <button
                  onClick={() => paginationHandler("next")}
                  className="page-link"
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
        {renderProductDetails()}
      </div>
    );
  }
}

export default ParcelDetails;
