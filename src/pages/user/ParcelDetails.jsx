import "../../assets/styles/user/parcel-details.css";
import ProductCard from "../../components/ProductCard";
import { API_URL } from "../../data/API";
import { useEffect, useState } from "react";
import Axios from "axios";
import AddedProductCard from "../../components/AddedProductCard";

function ParcelDetails(props) {
  //Get id_parcel from route params
  const id_parcel = props.match.params.id_parcel;

  //State for loading
  const [isLoading, setIsLoading] = useState(true);

  //State for saving parcel categories & qty
  const [parcelData, setParcelData] = useState({});

  //State for saving selected categories quantity
  const [selectedCategories, setSelectedCategories] = useState({});

  //State for saving products data
  const [products, setProducts] = useState([]);

  //State for saving added products & qty
  const [addedProducts, setAddedProducts] = useState([]);

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

  //Function to add product
  const addProduct = (id_product, indexProduct) => {
    //Add selected product to state addedProducts:

    //Find index in addProducts
    const indexAddedProduct = addedProducts.findIndex(
      (el) => el.id_product === id_product
    );

    //Get product data with selected id_product
    let addedProduct = products.find((el) => el.id_product === id_product);

    if (indexAddedProduct === -1) {
      //If the product not added before:

      //not exceed category quantity:
      if (
        selectedCategories[addedProduct.category] <
        parcelData.categories[addedProduct.category]
      ) {
        //Add props 'selected' for selected quantity
        addedProduct.selected = 1;

        //Increment selected category quantity
        setSelectedCategories({
          ...selectedCategories,
          [addedProduct.category]:
            selectedCategories[addedProduct.category] + 1,
        });

        //Push selected product to addedProducts
        setAddedProducts([...addedProducts, addedProduct]); //Rerender

        //Decrement product quantity
        products[indexProduct].product_quantity -= 1;
        // console.log(products[indexProduct]);
      }
    } else {
      //If its already added before:

      const arr = addedProducts; //use temporary array for easier state editing

      //not exceed category quantity:
      if (
        selectedCategories[addedProduct.category] <
        parcelData.categories[addedProduct.category]
      ) {
        arr[indexAddedProduct].selected += 1;

        //Increment selected category quantity
        setSelectedCategories({
          ...selectedCategories,
          [addedProduct.category]:
            selectedCategories[addedProduct.category] + 1,
        });

        //Increment props selected
        setAddedProducts([...arr]);

        //Decrement product quantity
        products[indexProduct].product_quantity -= 1;
      }
    }

    console.log(selectedCategories);

    //exceeded category quantity ALERT

    //Increment selected product-category

    //Decrement selected product quantity in state (in database after transaction succeed)
  };

  //Render product cards
  const renderProductCards = () => {
    return products.map((product, index) => {
      return (
        <ProductCard
          productData={product}
          addProduct={addProduct}
          index={index}
        />
      );
    });
  };

  //Render added product cards
  const renderAddedProductCards = () => {
    return addedProducts.map((product) => {
      return <AddedProductCard productData={product} />;
    });
  };

  //Get products data
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
        <div className="mx-5">
          <div className="row">
            <div className="parcel-info mb-2">
              {parcelData.name && <h1 className="mb-1">{parcelData.name}</h1>}
              <p className="mb-2 text-muted">
                {parcelData.categories && renderCategories()}
              </p>
              <p className="">
                <strong>Rp 120.000</strong>
              </p>
            </div>
            <div className="col-4 card">
              <div className="card-body">
                <h5 className="card-title mt-2 mb-4">Added Products</h5>
                {renderAddedProductCards()}
              </div>
            </div>
            <div className="col-8 products-container">
              {renderProductCards()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ParcelDetails;
