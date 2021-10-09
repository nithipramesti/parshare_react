function ParcelCard(props) {
  let parcelData = props.parcelData;

  return (
    <div className="card">
      <img src={parcelData.image_parcel} alt="" />
      <div className="card-body">
        <h5 className="card-title mb-0">{parcelData.parcel_name}</h5>
        <p className="card-text mb-2">
          <small class="text-muted">{parcelData.categories.join(", ")}</small>
        </p>
        <p className="card-text">Rp 120.000</p>
        <a href="#" className="btn btn-primary">
          See Details
        </a>
      </div>
    </div>
  );
}

export default ParcelCard;
