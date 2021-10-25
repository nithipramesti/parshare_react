import "../../assets/styles/admin/transactions.css";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import AdminTransactionsCard from "../../components/AdminTransactionsCard";
import { API_URL } from "../../data/API";
import { compile } from "date-and-time";
import AdminTransactionsDetails from "../../components/AdminTransactionsDetails";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

export const Transactions = () => {
  //Get global state data
  const authReducer = useSelector((state) => state.authReducer);

  //State to save transaction data
  const [transactionsData, setTransactionsData] = useState([]);

  //State to save filter status
  const [filterStatus, setFilterStatus] = useState("Pending");

  //State to save parcel list
  const [parcelList, setParcelList] = useState([]);

  //State for filtering by parcels
  const [activeParcel, setActiveParcel] = useState("");

  //State to save filtered data
  const [filteredData, setFilteredData] = useState([]);

  //State to save filtered data by PARCELS
  const [currentData, setCurrentData] = useState(filteredData);

  //State for transaction details modal
  const [modalToggle, setModalToggle] = useState({
    displayed: false,
    transactionIndex: null,
  });

  //Filter data by status
  useEffect(() => {
    console.log(filterStatus);

    let filtered = transactionsData.filter((val) => {
      if (filterStatus === "Pending") {
        return val.status === filterStatus;
      } else {
        return val.status === "Confirmed" || val.status === "Rejected";
      }
    });

    setFilteredData([...filtered]);
  }, [filterStatus]);

  //Filter data by status
  useEffect(() => {
    console.log(filterStatus);

    let filtered = transactionsData.filter((val) => {
      if (filterStatus === "Pending") {
        return val.status === filterStatus;
      } else {
        return val.status === "Confirmed" || val.status === "Rejected";
      }
    });

    let rawData = [...filtered];

    let filteredByParcel = rawData;

    if (activeParcel) {
      filteredByParcel = rawData.filter((val) => {
        const indexFind = val.parcels.findIndex(
          (el) => el.parcel_name === activeParcel
        );
        if (indexFind !== -1) {
          return true;
        }
      });
    }

    setFilteredData([...filteredByParcel]);
    setCurrentData([...filteredByParcel]);
  }, [filterStatus]);

  //Filter data by parcel
  useEffect(() => {
    let rawData = [...filteredData];

    let filteredByParcel = rawData;

    if (activeParcel) {
      filteredByParcel = rawData.filter((val) => {
        const indexFind = val.parcels.findIndex(
          (el) => el.parcel_name === activeParcel
        );
        if (indexFind !== -1) {
          return true;
        }
      });
    }

    setCurrentData([...filteredByParcel]);
  }, [activeParcel]);

  //Render transaction cards
  const renderTransactionCards = () => {
    console.log(currentData);

    return currentData.map((val, index) => {
      return (
        <AdminTransactionsCard
          transactionsData={val}
          index={index}
          setModalToggle={setModalToggle}
        />
      );
    });
  };

  //Render transaction details
  const renderTransactionDetails = () => {
    return (
      <AdminTransactionsDetails
        transactionData={currentData[modalToggle.transactionIndex]}
        setModalToggle={setModalToggle}
        setTransactionsData={setTransactionsData}
        setFilteredData={setFilteredData}
      />
    );
  };

  //Render parcel list filter
  const renderParcelList = () => {
    return parcelList.map((val) => {
      return <option value={val.parcel_name}>{val.parcel_name}</option>;
    });
  };

  //Fetching transaction data
  useEffect(() => {
    //Get user token
    const userLocalStorage = localStorage.getItem("token_parshare");

    //Get parcel list
    Axios.post(
      `${API_URL}/transactions/parcel-list`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userLocalStorage}`,
        },
      }
    ).then((res) => {
      console.log(res.data.parcelList);
      setParcelList(res.data.parcelList);
    });

    //Get transaction data
    Axios.post(
      `${API_URL}/transactions/get-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userLocalStorage}`,
        },
      }
    )
      .then((res) => {
        console.log(res.data.transactionsData);
        setTransactionsData([...res.data.transactionsData]);
        setFilteredData(
          [...res.data.transactionsData].filter(
            (val) => val.status === filterStatus
          )
        );
        setCurrentData(
          [...res.data.transactionsData].filter(
            (val) => val.status === filterStatus
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //////////

  if (authReducer.role === "admin") {
    return (
      <div className="transactions-admin mb-5">
        <h1 className="mb-4">Transactions</h1>
        <select
          className="form-select parcel-list-container mb-3"
          aria-label="Default select example"
          onChange={(e) => setActiveParcel(e.target.value)}
        >
          <option value="" selected>
            All Parcels
          </option>
          {renderParcelList()}
        </select>
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <a
              className={`nav-link ${
                filterStatus === `Pending` ? `active` : ""
              }`}
              onClick={() => setFilterStatus("Pending")}
            >
              Pending
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${
                filterStatus === `Completed` ? `active` : ""
              }`}
              onClick={() => setFilterStatus("Completed")}
            >
              Completed
            </a>
          </li>
        </ul>
        {currentData[0] ? (
          renderTransactionCards()
        ) : (
          <div className="text-center pt-5">
            <div className="spinner-border" role="status">
              <span class="visually-hidden">Loading transactions data...</span>
            </div>
          </div>
        )}
        {currentData[0] && modalToggle.displayed && renderTransactionDetails()}
      </div>
    );
  } else {
    return <Redirect to="/" />;
  }
};

export default Transactions;
