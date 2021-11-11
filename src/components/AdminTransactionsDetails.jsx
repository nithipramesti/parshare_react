import React, { useState } from "react";
import Axios from "axios";
import { API_URL } from "../data/API";

export const AdminTransactionsDetails = (props) => {
  //State for proof payment photo
  const [imageModal, setImageModal] = useState(false);

  //Destructuring transaction data (from props)
  const {
    id_transaction,
    fullname,
    parcels,
    transaction_date,
    transaction_totalprice,
    income,
    status,
    image_userpayment,
  } = props.transactionData;

  //Construct date:
  let transactionDate = new Date(transaction_date);

  //Get date, month, year from transaction date
  const fullDate = {
    date: transactionDate.getDate(),
    month: transactionDate.getMonth(),
    year: transactionDate.getFullYear(),
  };

  //Array to save months name
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

  //Render products in each parcel
  const renderProducts = (parcel) => {
    //Create array to store products
    const productsArray = [];

    parcel.products.forEach((val) => {
      productsArray.push(
        `${val.product_name} ${
          val.product_quantity > 1 ? `(${val.product_quantity})` : ""
        }`
      );
    });

    return productsArray.join(", ");
  };

  //Render parcels
  const renderParcels = () => {
    return parcels.map((parcel) => {
      return (
        <div className="parcel-product d-flex mb-2">
          <img src={`${API_URL}${parcel.image_parcel}`} alt="" />
          <div className="parcel-text ms-3">
            <p className="mb-1">
              <strong>{parcel.parcel_name}</strong>
            </p>
            <p className="transactions-products text-muted mb-1">
              {renderProducts(parcel)}
            </p>
          </div>
        </div>
      );
    });
  };

  //Function for confirm/reject transaction
  const transactionConfirmation = (newStatus) => {
    //Get user token
    const userLocalStorage = localStorage.getItem("token_parshare");

    Axios.patch(
      `${API_URL}/transactions/confirmation`,
      {
        id_transaction,
        newStatus,
        parcels,
      },
      {
        headers: {
          Authorization: `Bearer ${userLocalStorage}`,
        },
      }
    )
      .then((res) => {
        console.log(res.data.message);

        //Refresh page
        window.location.reload(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  ///////////////

  return (
    <div className={`details-bg m-0 p-0`} tabindex="-1">
      {/* Modal for displaying payment proof: */}
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
              onClick={() => props.setModalToggle(false)}
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
                    <span className="ms-1">Payment proof not uploaded yet</span>
                  </p>
                )}
                {status === "Pending" && (
                  <div className="button-container mt-3">
                    <button
                      className={`btn btn-success mb-2 ${
                        !image_userpayment ? `disabled` : ``
                      }`}
                      onClick={() => transactionConfirmation("Confirmed")}
                    >
                      Confirm Transaction
                    </button>
                    <button
                      className="btn btn-danger mb-2"
                      onClick={() => transactionConfirmation("Rejected")}
                    >
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
};

export default AdminTransactionsDetails;
