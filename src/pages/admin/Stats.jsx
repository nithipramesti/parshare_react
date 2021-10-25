import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { Redirect } from 'react-router-dom';
import Chart from 'react-apexcharts'
import Axios from 'axios';
import { API_URL } from '../../data/API';

function Stats(){
  const authReducer = useSelector((state) => state.authReducer);
  const [ parcelList, setParcelList ] = useState([]);
  const [ productList, setProductList ] = useState([]);
  const [ selectParcel, setSelectParcel ] = useState(1);
  const [ selectProduct, setSelectProduct ] = useState(1);
  const [ incomeSeries, setIncomeSeries ] = useState([]);
  const [ incomeOptions, setIncomeOptions ] = useState({});
  const [ parcelSeries, setParcelSeries ] = useState([]);
  const [ parcelOptions, setParcelOptions ] = useState({});
  const [ productSeries, setProductSeries ] = useState([]);
  const [ productOptions, setProductOptions ] = useState({});
  const [ selectPeriod, setSelectPeriod ] = useState(30);
  const [ availablePeriods, setAvailablePeriods ] = useState([7, 14, 30]);

  const fetchIncome = (period) => {
    Axios.get(`${API_URL}/transactions/income?period=${period}`, {
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
      let totalCapital = (obj).map(res => {
        return res.totalPrice - res.income
      });
      let date = (obj).map(res => {
        return res.date
      })
      setIncomeSeries([
        {
          name: "Income",
          data: income
        },
        {
          name: "Capital",
          data: totalCapital
        },
        {
          name: "Total Price",
          data: totalPrice
        }
      ])
      setIncomeOptions({
        chart: {
          id: "area",
          toolbar: {
            show: false
          },
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false | '<img src="/static/icons/reset.png" width="20">',
            customIcons: []
          },
          zoom: {
            enabled: false
          }
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
  const fetchParcelData = (id, period) => {
    Axios.get(`${API_URL}/parcels/revenue?id=${id}&period=${period}`, {
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
      let totalCapital = (obj).map(res => {
        return res.totalPrice - res.totalMargin
      });
      let date = (obj).map(res => {
        return res.date
      })
      setParcelSeries([
        {
          name: "Sold",
          data: totalSold
        },
        {
          name: "Margin",
          data: totalMargin
        },
        {
          name: "Capital",
          data: totalCapital
        },
        {
          name: "Total Price",
          data: totalPrice
        }
      ])
      setParcelOptions({
        chart: {
          id: "area",
          toolbar: {
            show: false
          },
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false | '<img src="/static/icons/reset.png" width="20">',
            customIcons: []
          },
          zoom: {
            enabled: false
          }
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
  const fetchProductData = (id, period) => {
    Axios.get(`${API_URL}/products/sold?id=${id}&period=${period}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
      }
    })
    .then(res => {
      let obj = res.data.data.reverse();
      let totalSold = (obj).map(res => {
        return res.total
      });
      let date = (obj).map(res => {
        return res.date
      })
      setProductSeries([
        {
          name: "Sold",
          data: totalSold
        }
      ])
      setProductOptions({
        chart: {
          id: "area",
          toolbar: {
            show: false
          },
          tools: {
            download: false,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false | '<img src="/static/icons/reset.png" width="20">',
            customIcons: []
          },
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          type: "datetime",
          categories: date
        },
        tooltip: {
          followCursor: true,
          y: {
            formatter: function(value, {seriesIndex}) {
              return value.toLocaleString();
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
  const fetchProductList = () => {
    Axios.get(`${API_URL}/products/list`)
    .then(res => {
      setProductList(res.data.data)
    })
    .catch(err => {
      alert("Error: " + err.message);
    })
  }
  const changeParcel = (e) => {
    const value = e.target.value;
    setSelectParcel(value);
    fetchParcelData(value, selectPeriod);
  }
  const changeProduct = (e) => {
    const value = e.target.value;
    setSelectProduct(value);
    fetchProductData(value, selectPeriod);
  }
  const selectPeriodHandler = (period) => {
    setSelectPeriod(period);
    fetchParcelData(selectParcel, period);
    fetchProductData(selectProduct, period);
    fetchIncome(period);
  }

  useEffect(() => {
    if(authReducer.role !== "admin"){
      return <Redirect to="/login"/>
    }else{
      fetchIncome();
      fetchParcelData(1);
      fetchParcelList();
      fetchProductData(1);
      fetchProductList();
    }
  }, []);
  
  if(authReducer.role !== "admin"){
    return <Redirect to="/login"/>
  }else{
    return (
      <div className="container container-top">
        <h1 style={{display: "inline-block", marginRight: "10px"}}>Statictics</h1>
        {
          availablePeriods.map(res => {
            return(
              <div className="border border-secondary" onClick={() => selectPeriodHandler(res)} style={
                res === selectPeriod ?
                  {cursor: "pointer", background: "#041E43", color: "#fff", display: 'inline-block', padding: "2px 10px 2px 10px", minWidth: "60px", marginRight: "3px", borderRadius: "20px", marginBottom: "2px", textAlign: "center"}
                : {cursor: "pointer", background: "#fff", color: "#000", display: 'inline-block', padding: "2px 10px 2px 10px", minWidth: "60px", marginRight: "3px", borderRadius: "20px", marginBottom: "2px", textAlign: "center"}
              }>
                {res} days
              </div>
            )
          })
        }
        <div className="border rounded">
          <h5 style={{marginTop: "10px", marginLeft: "10px"}}>Total income in {selectPeriod} days</h5>
          <Chart options={incomeOptions} type="area" series={incomeSeries} width="100%" height="300px" />
        </div>
        <div className="border rounded mt-4">
          <h5 style={{marginTop: "10px", marginLeft: "10px", display: "inline-block"}}>Total parcel</h5>
          <select style={{display: 'inline-block', width: "initial", marginLeft: "10px", marginRight: "10px"}} class="form-select" aria-label="Default select example" name="parcel" onChange={changeParcel}>
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
          <h5 style={{display: 'inline-block', marginRight: "10px"}}>sold in {selectPeriod} days</h5>
          <Chart options={parcelOptions} type="area" series={parcelSeries} width="100%" height="300px" />
        </div>
        <div className="border rounded mt-4">
          <h5 style={{marginTop: "10px", marginLeft: "10px", display: "inline-block"}}>Total product</h5>
          <select style={{display: 'inline-block', width: "initial", marginLeft: "10px", marginRight: "10px"}} class="form-select" aria-label="Default select example" name="parcel" onChange={changeProduct}>
            {
              productList.map(parcel => {
                if(selectProduct === parcel.id_product){
                  return <option value={parcel.id_product} selected>{parcel.product_name}</option>
                }else{
                  return <option value={parcel.id_product}>{parcel.product_name}</option>
                }
              })
            }
          </select>
          <h5 style={{display: 'inline-block', marginRight: "10px"}}>sold in {selectPeriod} days</h5>
          <Chart options={productOptions} type="area" series={productSeries} width="100%" height="300px" />
        </div>
      </div>
    )
  }
}

export default Stats;