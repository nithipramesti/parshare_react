import "../../assets/styles/admin/transactions.css";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import AdminTransactionsCard from "../../components/AdminTransactionsCard";
import { API_URL } from "../../data/API";
import { compile } from "date-and-time";

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

  useEffect(() => {
    console.log(filterStatus);

    let filtered = transactionsData.filter((val) => {
      if (filterStatus === "Pending") {
        return val.status === filterStatus;
      } else {
        return val.status === "Confirmed" || val.status === "Rejected";
      }
    });

    setFilteredData([...filtered]); //not trigger rerender?
  }, [filterStatus]);

  //Render transaction cards
  const renderTransactionCards = () => {
    console.log(filteredData); //empty every change filterStatus??!!
    return filteredData.map((val, index) => {
      return (
        <AdminTransactionsCard
          transactionsData={val}
          index={index}
          setModalToggle={setModalToggle}
        />
      );
    });
  };

  const [imageModal, setImageModal] = useState(false);

  //Render transaction details
  const renderTransactionDetails = () => {
    if (modalToggle.displayed) {
      const {
        id_transaction,
        fullname,
        parcels,
        transaction_date,
        transaction_totalprice,
        income,
        status,
        image_userpayment,
      } = transactionsData[modalToggle.transactionIndex];

      //Construct date:
      let transactionDate = new Date(transaction_date);

      const fullDate = {
        date: transactionDate.getDate(),
        month: transactionDate.getMonth() + 1,
        year: transactionDate.getFullYear(),
      };

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      //////

      //Create array to store products
      const productsArray = [];
      parcels[0].products.forEach((val) => {
        productsArray.push(
          `${val.product_name} ${
            val.product_quantity > 1 ? `(${val.product_quantity})` : ""
          }`
        );
      });

      //Render parcels
      const renderParcels = () => {
        return parcels.map((val) => {
          return (
            <div className="parcel-product d-flex mb-2">
              <img src={`${API_URL}${val.image_parcel}`} alt="" />
              <div className="parcel-text ms-3">
                <p className="mb-1">
                  <strong>{val.parcel_name}</strong>
                </p>
                <p className="transactions-products text-muted mb-1">
                  {productsArray.join(", ")}
                </p>
              </div>
            </div>
          );
        });
      };

      return (
        <div
          className={`details-bg ${!modalToggle.displayed && `modal`} m-0 p-0`}
          tabindex="-1"
        >
          {imageModal && (
            <div className="payment-proof-modal">
              <div className="image-container">
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setImageModal(false)}
                ></button>
                <img src={`${API_URL}${image_userpayment}`} alt="" />
              </div>
            </div>
          )}
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Transaction Details</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalToggle(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body d-flex py-4">
                <div className="modal-body-left">
                  <div className="transaction-info mb-4 d-flex">
                    <div className="transaction-info-1">
                      <p className="mt-0 mb-1">
                        <strong>Transaction Date: </strong>
                        {`${fullDate.date} ${monthNames[fullDate.month]} ${
                          fullDate.year
                        }`}
                      </p>
                      <p className="mt-0 mb-1">
                        <strong>Invoice No: </strong>
                        {`INV/${fullDate.year}${fullDate.month}${fullDate.date}/PAR/${id_transaction}`}
                      </p>
                      <p className="mt-0 mb-1">
                        <strong>Buyer: </strong>
                        {fullname}
                      </p>
                    </div>
                    <div className="transaction-info-2">
                      <div className="revenue">
                        <p className="mt-0 mb-1">
                          <strong>Revenue: </strong>
                          {`Rp ${transaction_totalprice.toLocaleString()}`}
                        </p>
                      </div>
                      <div className="profit">
                        <p className="mt-0 mb-1">
                          <strong>Profit: </strong>
                          {`Rp ${income.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="parcel-container">
                    <h5>Parcel Details</h5>
                    {renderParcels()}
                  </div>
                </div>
                <div className="modal-body-right">
                  <div className="status-container mb-4">
                    <p className="mb-2">
                      <strong>Status</strong>
                    </p>
                    <p className={`status ${status}`}>{status}</p>
                  </div>
                  <div className="confirmation mb-3">
                    <p className="mb-2">
                      <strong>Transaction Confirmation</strong>
                    </p>
                    {image_userpayment ? (
                      <a
                        className="link-primary"
                        onClick={() => setImageModal(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          class="bi bi-image"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                          <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                        </svg>
                        <span className="ms-1">Payment proof</span>
                      </a>
                    ) : (
                      <p className="text-muted">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-exclamation-circle"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                        </svg>
                        <span className="ms-1">
                          Payment proof not uploaded yet
                        </span>
                      </p>
                    )}
                    {status === "Pending" && (
                      <div className="button-container mt-3">
                        <button className="btn btn-success mb-2">
                          Confirm Transaction
                        </button>
                        <button className="btn btn-danger mb-2">
                          Reject Transaction
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  //Fetching transaction data
  useEffect(() => {
    Axios.get(`${API_URL}/transactions/getAll`)
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
      {transactionsData[0] && renderTransactionDetails()}
    </div>
  );
};

export default Transactions;
