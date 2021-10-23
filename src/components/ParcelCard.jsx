import { Link } from "react-router-dom";
import { API_URL } from "../data/API";

function ParcelCard(props) {
  let parcelData = props.parcelData;

  return (
    <div className="card">
      <img src={`${API_URL}${parcelData.image_parcel}`} alt="" />
      <div className="card-body">
        <h5 className="card-title mb-0">{parcelData.parcel_name}</h5>
        <p className="card-text mb-2">
          <small className="text-muted">
            {parcelData.categories.join(", ")}
          </small>
        </p>
        <p className="card-text">
          Rp {parcelData.parcel_price.toLocaleString()}
        </p>
        <Link
          to={`/parcel/${parcelData.id_parcel}`}
          className="btn btn-primary"
        >
          See Details
        </Link>
      </div>
    </div>
  );
}

export default ParcelCard;
