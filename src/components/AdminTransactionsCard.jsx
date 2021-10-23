import React from "react";
import { API_URL } from "../data/API";

export const AdminTransactionsCard = (props) => {
  const {
    id_transaction,
    fullname,
    parcels,
    transaction_date,
    transaction_totalprice,
    income,
    status,
  } = props.transactionsData;

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

  return (
    <div className="card mb-3">
      <div className="card-header d-flex">
        <p className="mb-0 me-3">{`${fullDate.date} ${
          monthNames[fullDate.month]
        } ${fullDate.year}`}</p>
        <p className="text-muted mb-0">
          <small>{`INV/${fullDate.year}${fullDate.month}${fullDate.date}/PAR/${id_transaction}`}</small>
        </p>
      </div>
      <ul className="list-group list-group-flush pb-3">
        <li className="list-group-item">
          <p className="mt-2 mb-0">
            <strong>{fullname}</strong>
          </p>

          <div className="d-flex">
            <div className="parcel-info d-flex">
              <img src={`${API_URL}${parcels[0].image_parcel}`} alt="" />
              <div className="parcel-text ms-3">
                <p className="mb-1">
                  <strong>{parcels[0].parcel_name}</strong>
                </p>
                <p className="transactions-products text-muted mb-1">
                  {productsArray.join(", ")}
                </p>
                <p className="mb-2 text-muted">
                  {parcels.length > 1
                    ? `+${parcels.length - 1} other parcel(s)`
                    : null}
                </p>
                <a
                  className="see-details"
                  onClick={() => {
                    props.setModalToggle({
                      displayed: true,
                      transactionIndex: props.index,
                    });
                  }}
                >
                  <strong>See Transactions Details</strong>
                </a>
              </div>
            </div>
            <div className="revenue-status me-4">
              <div className="revenue">
                <p className="mb-0">
                  <strong>Revenue:</strong>
                </p>
                <p>
                  <small>{`Rp ${transaction_totalprice.toLocaleString()}`}</small>
                </p>
              </div>
              <div className="status-container">
                <p className="mb-1">
                  <strong>Status:</strong>
                </p>
                <p>
                  <small className={`status ${status}`}>{status}</small>
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AdminTransactionsCard;
