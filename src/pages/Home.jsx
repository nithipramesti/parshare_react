import "../assets/styles/home.css";

import { useSelector } from "react-redux";
import Axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../data/API";
import ParcelCard from "../components/ParcelCard";

function Home() {
  //Global state
  const authReducer = useSelector((state) => state.authReducer);

  //State
  const [parcelData, setParcelData] = useState([]);

  //Before render page:
  useEffect(() => {
    //Get parcel data from database
    Axios.get(`${API_URL}/parcels/get-parcels-user`)
      .then((res) => {
        console.log(res.data.dataParcels);

        //create new array to save parcel data
        let parcels = [];

        //looping res.data (array of object) from backend
        for (let i = 0; i < res.data.dataParcels.length; i++) {
          let rawObject = res.data.dataParcels[i]; //object from backend

          if (rawObject.active === "true") {
            //destructure rawObject to get parcel data (without categories)
            let { id_parcel, parcel_name, parcel_price, image_parcel, active } =
              rawObject;

            let idParcelNotFound = true; //'false' if id_parcel found, will stay 'true' if id_parcel not found

            //check if object with id_parcel from rawObject exist in parcels (state)
            parcels.forEach((parcelObj) => {
              if (parcelObj.id_parcel === rawObject.id_parcel) {
                //if object with id_parcel already exist in parcels, insert category & quantity to parcels.categories (an object)
                parcelObj.categories.push(rawObject.category);
                idParcelNotFound = false;
              }
            });

            if (idParcelNotFound) {
              //if not exist yet, create new object in parcels
              //Create new props to save categories (as an array), and save current category
              parcels.push({
                id_parcel,
                parcel_name,
                parcel_price,
                image_parcel,
                active,
                categories: [rawObject.category],
              });
            }
          }
        }
        //Save parcel data to local state:
        setParcelData(parcels);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(parcelData);
  // console.log("categories", parcelData[0].parcel_name);

  //render parcels
  const renderParcels = () => {
    return parcelData.map((val) => {
      return <ParcelCard parcelData={val} />;
    });
  };

  let username = authReducer.username;

  return (
    <div className="home">
      <main className="">
        <div className="main-left">
          <h1 className="headline-text mb-5">
            Make someone’s <br />
            day with our <br />
            <em>special parcel</em>
          </h1>
          <a className="btn btn-primary" id="btn-main" href="#parcel-section">
            Shop Parcels
          </a>
        </div>
        <div className="main-right"></div>
      </main>
      <div id="parcel-section">
        {parcelData.length ? renderParcels() : <p>Loading parcel data...</p>}
      </div>
    </div>
  );
}

export default Home;
