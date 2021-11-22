import "../../assets/styles/user/parcel-details.css";
import ProductCard from "../../components/ProductCard";
import { API_URL } from "../../data/API";
import { useEffect, useState } from "react";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AddedProductCard from "../../components/AddedProductCard";
import { Link, useHistory, useLocation } from "react-router-dom";

function ParcelDetails(props) {
  //Get id_parcel from route params
  const id_parcel = props.match.params.id_parcel;

  //Get id_cart from query params
  const search = useLocation().search;
  const id_cart = new URLSearchParams(search).get("id_cart");
  // const id_cart = props.match.params.id_cart;

  //Dispatch
  const dispatch = useDispatch();

  //For redirecting
  const history = useHistory();

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
    id_categoriesQuery: "",
    id_categoriesQueryFiltered: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  //State for saving filtered products data
  const [filteredProducts, setFilteredProducts] = useState([]);

  //State for saving category filter
  const [filterCategory, setFilterCategory] = useState("All");

  //State for sorting
  const [sortBy, setSortBy] = useState("");

  //State for search value
  const [searchValue, setSearchValue] = useState("");

  //State for saving added products & quantity
  const [addedProducts, setAddedProducts] = useState([]);

  //State for product details modal
  const [modalToggle, setModalToggle] = useState({
    displayed: false,
    product: {},
  });

  //State for saving added products & quantity
  const [alertMessage, setAlertMessage] = useState("");

  //Function for pagination
  const paginationHandler = (direction) => {
    if (direction === "next") {
      if (currentPage < pagination.maxPage) {
        // setPagination({ ...pagination, page: pagination.page + 1 });
        setCurrentPage(currentPage + 1);
      }
    } else if (direction === "previous") {
      if (currentPage > 0) {
        // setPagination({ ...pagination, page: pagination.page - 1 });
        setCurrentPage(currentPage - 1);
      }
    }
  };

  useEffect(() => {
    let sortByQuery = "";
    sortByQuery = sortBy ? `p.product_name ${sortBy}` : `p.id_product ASC`;

    //Send request to backend
    Axios.post(`${API_URL}/products/getPerPage/`, {
      id_categoriesQuery: pagination.id_categoriesQueryFiltered,
      startIndex: (currentPage - 1) * pagination.itemPerPage + 1,
      itemPerPage: pagination.itemPerPage,
      sortBy: sortByQuery,
      searchValue: "",
    })
      .then((res) => {
        console.log("Change current page");
        console.log(res.data.products);

        //Change products data in state
        const ar = res.data.products;
        setProducts([...ar]);
        //Save products data to filter state
        setFilteredProducts([...ar]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [currentPage]);

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

        //Delete product from addedProducts
        let arr = addedProducts;
        arr.splice(index, 1);
        setAddedProducts([...arr]);
      }
    }
  };

  //Function to add product
  const addProduct = (id_product) => {
    //Check if user already login & not an admin
    if (authReducer.role === "user") {
      //Check if user have filled their profile data
      if (authReducer.fullname && authReducer.address) {
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
      } else {
        setAlertMessage(
          "Please fill your fullname & address in your account setting."
        );
      }
    } else {
      setAlertMessage("Please log in or register first.");
    }
  };

  //Function to add parcel to CART.
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

    if (cartReady) {
      Axios.post(`${API_URL}/cart/add`, {
        id_user: authReducer.id_user,
        id_parcel: id_parcel,
        products: addedProducts,
      }).then((res) => {
        let cartArray = [];

        res.data.data.forEach((val) => {
          let index = cartArray.findIndex((el) => el.id_cart === val.id_cart);

          if (index === -1) {
            const {
              id_parcel,
              id_cart,
              id_user,
              parcel_name,
              parcel_price,
              image_parcel,
            } = val;

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
            cartArray[index].products[val.product_name] = val.product_quantity;
          }
        });

        //Redirect to cart page
        history.push("/user/cart");
      });
    } else {
      setAlertMessage(
        `Please choose the product with the correct quantity: ${renderCategories()}`
      );
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

    if (cartReady) {
      Axios.patch(`${API_URL}/cart/edit`, {
        id_user: authReducer.id_user,
        id_cart: id_cart,
        id_parcel: id_parcel,
        products: addedProducts,
      }).then((res) => {
        history.push("/user/cart");
      });
    } else {
      setAlertMessage(
        `Please choose the product with the correct quantity: ${renderCategories()}`
      );
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
                <img
                  className="pe-3"
                  src={`${API_URL}${modalToggle.product.image_product}`}
                  alt=""
                />
                <div className="info-text pe-4">
                  <div>
                    <p className="mb-0">
                      <strong>Category: </strong>
                    </p>
                    <p className="text-muted">{modalToggle.product.category}</p>
                  </div>
                  <div>
                    <p className="mb-0">
                      <strong>Description:</strong>
                    </p>
                    <p className="product-details-modal text-muted">
                      {modalToggle.product.description}
                    </p>
                  </div>
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
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addProduct(modalToggle.product.id_product)}
                >
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
    // let arr = products;
    let id_categoriesQuery = pagination.id_categoriesQuery;
    // console.log(pagination.id_categoriesQuery);
    if (filterCategory !== "All") {
      // arr = products.filter((val) => val.category === filterCategory);
      // console.log("arr", arr)
      id_categoriesQuery = [`c.category = "${filterCategory}"`];
    }

    let sortByQuery = "";
    sortByQuery = sortBy ? `p.product_name ${sortBy}` : `p.id_product ASC`;

    setCurrentPage(1);

    //Send request to backend
    Axios.post(`${API_URL}/products/getFilter/`, {
      id_categoriesQuery: id_categoriesQuery,
      startIndex: 0 * pagination.itemPerPage + 1,
      itemPerPage: pagination.itemPerPage,
      sortBy: sortByQuery,
      searchValue,
    })
      .then((res) => {
        console.log("change filter category");
        console.log(res.data.products);

        //Set max page -- depends on products number
        const maxPage = Math.ceil(
          res.data.totalProducts / pagination.itemPerPage
        );
        setPagination({
          ...pagination,
          maxPage,
        });

        //Change products data in state
        const ar = res.data.products;
        setProducts([...ar]);
        //Save products data to filter state
        setFilteredProducts([...ar]);

        setPagination({
          ...pagination,
          id_categoriesQueryFiltered: id_categoriesQuery,
        });
      })
      .catch((err) => {
        console.log(err);
      });

    // setFilteredProducts([...arr]);

    // const maxPage = Math.ceil(arr.length / pagination.itemPerPage);
    // setPagination({ ...pagination, maxPage });
    // console.log(maxPage);

    //Send request to backend
    // Axios.post(`${API_URL}/products/getPerPage/`, {
    //   id_categoriesQuery: pagination.id_categoriesQuery,
    //   startIndex: (pagination.page - 1) * pagination.itemPerPage + 1,
    //   itemPerPage: pagination.itemPerPage,
    // })
    //   .then((res) => {
    //     console.log("MAAA");
    //     console.log(res.data.products);

    //     //Change products data in state
    //     const ar = res.data.products;
    //     setProducts([...ar]);
    //     //Save products data to filter state
    //     setFilteredProducts([...ar]);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, [filterCategory]);

  useEffect(() => {
    console.log("filteredquery", pagination.id_categoriesQueryFiltered);
    setCurrentPage(1);

    let sortByQuery = "";
    sortByQuery = sortBy ? `p.product_name ${sortBy}` : `p.id_product ASC`;

    //Send request to backend
    Axios.post(`${API_URL}/products/getFilter/`, {
      id_categoriesQuery: pagination.id_categoriesQueryFiltered,
      startIndex: 0 * pagination.itemPerPage + 1,
      itemPerPage: pagination.itemPerPage,
      sortBy: sortByQuery,
      searchValue,
    })
      .then((res) => {
        console.log("SORT");
        console.log(res.data.products);
        //Set max page -- depends on products number
        const maxPage = Math.ceil(
          res.data.totalProducts / pagination.itemPerPage
        );
        setPagination({
          ...pagination,
          maxPage,
        });
        //Change products data in state
        const ar = res.data.products;
        setProducts([...ar]);
        //Save products data to filter state
        setFilteredProducts([...ar]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [sortBy]);

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
    setSearchValue(event.target.value);
  };

  const searchProducts = () => {
    setCurrentPage(1);
    // alert(searchValue);
    Axios.post(`${API_URL}/products/getFilter/`, {
      id_categoriesQuery: pagination.id_categoriesQuery,
      startIndex: 0 * pagination.itemPerPage + 1,
      itemPerPage: pagination.itemPerPage,
      sortBy: `p.id_product ASC`,
      searchValue,
    })
      .then((res) => {
        console.log("SEARCH");
        console.log(res.data.products);
        //Set max page -- depends on products number
        const maxPage = Math.ceil(
          res.data.totalProducts / pagination.itemPerPage
        );
        setPagination({
          ...pagination,
          maxPage,
        });
        //Change products data in state
        const ar = res.data.products;
        setProducts([...ar]);
        //Save products data to filter state
        setFilteredProducts([...ar]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Render product cards
  const renderProductCards = () => {
    const beginningIndex = (currentPage - 1) * pagination.itemPerPage;
    let rawData = [...filteredProducts];

    // const compareString = (a, b) => {
    //   if (a.product_name < b.product_name) {
    //     return -1;
    //   } else if (a.product_name > b.product_name) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // };

    // switch (sortBy) {
    //   case "az":
    //     rawData.sort(compareString);
    //     break;

    //   case "za":
    //     rawData.sort((a, b) => compareString(b, a));
    //     break;

    //   default:
    //     rawData = [...filteredProducts];
    //     break;
    // }

    const currentData = rawData;

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

  //Render alert message
  const renderAlertMsg = () => {
    return (
      <div className="alert alert-warning alert-msg px-5 mb-2" role="alert">
        {alertMessage}
      </div>
    );
  };

  //Fetching product data
  useEffect(() => {
    //Send request to backend
    Axios.post(`${API_URL}/products/get/${id_parcel}`, {
      startIndex: (currentPage - 1) * pagination.itemPerPage + 1,
      itemPerPage: pagination.itemPerPage,
      sortBy: "p.id_product ASC",
    })
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
            res.data.totalProducts / pagination.itemPerPage
          );
          setPagination({
            ...pagination,
            maxPage,
            id_categoriesQuery: res.data.id_categoriesQuery,
            id_categoriesQueryFiltered: res.data.id_categoriesQuery,
          });

          setIsLoading(false);
        } else {
          alert(res.data.errMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="parcel-detail">
        <div className="text-center pt-5">
          <div className="spinner-border" role="status">
            <span class="visually-hidden">Loading transactions data...</span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="parcel-detail">
        {alertMessage && renderAlertMsg()}
        <div className="mx-5 main">
          <div className="row">
            <div className="parcel-info ps-0 mb-3">
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
                      onClick={searchProducts}
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
                {id_cart ? (
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
                    <option value="ASC">A - Z</option>
                    <option value="DESC">Z - A</option>
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
                className={`page-item ${currentPage === 1 ? `disabled` : ``}`}
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
                <button className="page-link">{`${currentPage} / ${pagination.maxPage}`}</button>
              </li>
              <li
                className={`page-item ${
                  currentPage === pagination.maxPage ? `disabled` : ``
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
