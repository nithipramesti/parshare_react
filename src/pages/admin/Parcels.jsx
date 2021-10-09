import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Axios from 'axios';
import { API_URL } from '../../data/API';
import { DataGrid } from '@mui/x-data-grid';

function Parcels(){
  const authReducer = useSelector((state) => state.authReducer);

  const [ parcelList, setParcelList ] = useState([])
  const fetchParcel = () => {
    Axios.get(`${API_URL}/parcels/list`)
    .then(res => {
      setParcelList(res.data.data);
    })
    .catch(err => {
      alert("Failed to get parcels list! Please refresh to try again")
    })
  }

  useEffect(() => {
    fetchParcel();
  })

  const renderGrid = () => {
    const columns = [
      {
        field: 'id',
        headerName: '#',
        type: 'number',
        numeric: true,
        headerAlign: 'center',
        sortable: true,
        width: 50,
      },
      {
        field: 'image_parcel',
        headerName: ' ',
        headerAlign: 'center',
        width: 65,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <img src={params.value} height="50px"></img>
        )
      },
      {
        field: 'parcel_name',
        headerName: 'Name',
        headerAlign: 'center',
        width: 200,
      },
      {
        field: 'parcel_description',
        headerName: 'Description',
        headerAlign: 'center',
        width: 200,
      }, 
      {
        field: 'categoryQuantity',
        headerName: 'Category',
        headerAlign: 'center',
        width: 300,
        sortable: false,
        renderCell: (params) => (
          <>
            {
              ((params.value[0]).split(",")).map((cat, qty) => {
                return <span class="badge alert-primary" style={{marginRight:"5px"}}>{(params.value[1]).split(",")[qty]} {cat}</span>
              })
            }
          </>
        )
      },
      {
        field: 'parcel_price',
        headerName: 'Price',
        headerAlign: 'center',
        width: 150,
        renderCell: (params) => (
          <>
          Rp {params.value.toLocaleString()}
          </>
        )
      },
      {
        field: 'margin',
        headerName: 'Profit',
        headerAlign: 'center',
        width: 150,
        renderCell: (params) => (
          <>
          Rp {params.value.toLocaleString()}
          </>
        )
      },
      {
        field: 'active',
        headerName: 'Status',
        headerAlign: 'center',
        width: 150,
        renderCell: (params) => (
          <>
          {
            params.value === "true" ?
              <span class="badge alert-success">Active</span>
            : <span class="badge alert-danger">Deleted</span>
          }
          </>
        )
      }
    ];

    return <DataGrid
      rows={parcelList} 
      columns={columns} 
      autoHeight
      hideFooterSelectedRowCount
      style={{marginTop: "15px"}}
    />
  }

  if(authReducer.role !== "admin"){
    return <Redirect to="/login"/>
  }else{
    return(
      <div className="container container-top">
        <h1>Parcels</h1>
        {renderGrid()}
      </div>
    )
  }
}

export default Parcels;