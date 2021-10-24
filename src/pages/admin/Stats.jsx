import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';
import Chart from 'react-apexcharts'
import Axios from 'axios';
import { API_URL } from '../../data/API';

function Stats(){
  const authReducer = useSelector((state) => state.authReducer);
  const [ parcelList, setParcelList ] = useState([]);
  const [ selectParcel, setSelectParcel ] = useState(1);
  const [ incomeSeries, setIncomeSeries ] = useState([]);
  const [ incomeOptions, setIncomeOptions ] = useState({});
  const [ parcelSeries, setParcelSeries ] = useState([]);
  const [ parcelOptions, setParcelOptions ] = useState({});

  const fetchIncome = () => {
    Axios.get(`${API_URL}/transactions/income`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
      }
    })
    .then(res => {
      let obj = res.data.data.reverse();
      let income = (obj).map(res => {
        return res.income
      });
      let totalPrice = (obj).map(res => {
        return res.totalPrice
      });
      let date = (obj).map(res => {
        const date = new Date(res.date);
        return `${date.getDate()} ${date.toDateString().substr(4, 3)}`
      })
      setIncomeSeries([
        {
          name: "Income",
          data: income
        },
        {
          name: "Total Price",
          data: totalPrice
        }
      ])
      setIncomeOptions({
        chart: {
          id: "area"
        },
        xaxis: {
          type: "datetime",
          categories: date
        },
        tooltip: {
          followCursor: true,
          y: {
            formatter: function (value) {
              return `Rp ${value.toLocaleString()}`;
            }
          }
        }
      });
    })
    .catch(err => {
      alert("Error: " + err.message);
    })
  }
  const fetchParcelData = (id) => {
    Axios.get(`${API_URL}/parcels/revenue?id=${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
      }
    })
    .then(res => {
      let obj = res.data.data.reverse();
      let totalSold = (obj).map(res => {
        return res.total
      });
      let totalPrice = (obj).map(res => {
        return res.totalPrice
      });
      let totalMargin = (obj).map(res => {
        return res.totalMargin
      });
      let date = (obj).map(res => {
        const date = new Date(res.date);
        return `${date.getDate()} ${date.toDateString().substr(4, 3)}`
      })
      setParcelSeries([
        {
          name: "Sold",
          data: totalSold
        },
        {
          name: "Total Price",
          data: totalPrice
        },
        {
          name: "Margin",
          data: totalMargin
        }
      ])
      setParcelOptions({
        chart: {
          id: "area"
        },
        xaxis: {
          type: "datetime",
          categories: date
        },
        tooltip: {
          followCursor: true,
          y: {
            formatter: function(value, {seriesIndex}) {
              if(seriesIndex !== 0){
                return `Rp ${value.toLocaleString()}`;
              }else{
                return value.toLocaleString();
              }
            }
          }
        }
      });
    })
    .catch(err => {
      alert("Error: " + err.message);
    })
  }
  const fetchParcelList = () => {
    Axios.get(`${API_URL}/parcels/list`)
    .then(res => {
      setParcelList(res.data.data)
    })
    .catch(err => {
      alert("Error: " + err.message);
    })
  }
  const changeParcel = (e) => {
    const value = e.target.value;
    setSelectParcel(value);
    fetchParcelData(value);
  }

  useEffect(() => {
    if(authReducer.role !== "admin"){
      return <Redirect to="/login"/>
    }else{
      fetchIncome();
      fetchParcelData(1);
      fetchParcelList();
    }
  }, []);
  
  if(authReducer.role !== "admin"){
    return <Redirect to="/login"/>
  }else{
    return (
      <div className="container container-top">
        <h1>Income</h1>
        <Chart options={incomeOptions} type="area" series={incomeSeries} width="100%" height="300px" />
        <h1 style={{display: 'inline-block'}}>Parcels</h1>
        <select style={{display: 'inline-block', width: "initial", marginLeft: "10px"}} class="form-select" aria-label="Default select example" name="parcel" onChange={changeParcel}>
          {
            parcelList.map(parcel => {
              if(selectParcel === parcel.id_parcel){
                return <option value={parcel.id_parcel} selected>{parcel.parcel_name}</option>
              }else{
                return <option value={parcel.id_parcel}>{parcel.parcel_name}</option>
              }
            })
          }
        </select>
        <Chart options={parcelOptions} type="area" series={parcelSeries} width="100%" height="300px" />
      </div>
    )
  }
}

export default Stats;