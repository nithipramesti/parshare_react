import "../../assets/styles/admin/transactions.css";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import UserTransactionsCard from "../../components/UserTransactionsCard";
import { API_URL } from "../../data/API";
import { compile } from "date-and-time";
import UserTransactionsDetails from "../../components/UserTransactionsDetails";

export const Transactions = () => {
  //State to save transaction data
  const [transactionsData, setTransactionsData] = useState([]);

  //State to save filter status
  const [filterStatus, setFilterStatus] = useState("Pending");

  //State to save filtered data
  const [filteredData, setFilteredData] = useState([]);

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

  //Render transaction cards
  const renderTransactionCards = () => {
    console.log(filteredData); //empty every change filterStatus??!!
    return filteredData.map((val, index) => {
      return (
        <UserTransactionsCard
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
      <UserTransactionsDetails
        transactionData={filteredData[modalToggle.transactionIndex]}
        setModalToggle={setModalToggle}
        setTransactionsData={setTransactionsData}
        setFilteredData={setFilteredData}
      />
    );
  };

  //Fetching transaction data
  useEffect(() => {
    //Get user token
    const userLocalStorage = localStorage.getItem("token_parshare");

    Axios.get(
      `${API_URL}/transactions/getTransactions`,
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //////////

  return (
    <div className="transactions-admin mb-5">
      <h1 className="mb-4">Transactions</h1>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <a
            className={`nav-link ${filterStatus === `Pending` ? `active` : ""}`}
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
      {transactionsData[0] && renderTransactionCards()}
      {transactionsData[0] &&
        modalToggle.displayed &&
        renderTransactionDetails()}
    </div>
  );
};

export default Transactions;
