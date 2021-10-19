import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Axios from 'axios';
import { API_URL } from '../../data/API';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Alert } from 'react-bootstrap';

function Parcels(){
  const authReducer = useSelector((state) => state.authReducer);

  const [ parcelList, setParcelList ] = useState([])
  const [ selectCategory, setSelectCategory ] = useState([]);
  const [ selectEditCategory, setSelectEditCategory ] = useState([]);
  const [ avgPriceProductCategory, setAvgPriceProductCategory] = useState([]);
  const [ showAlert, setShowAlert ] = useState({});
  const [ showAddParcel, setShowAddParcel ] = useState(false);
  const [ inputImage, setInputImage ] = useState({});
  const [ inputParcel, setInputParcel ] = useState({});
  const [ categoryList, setCategoryList ] = useState([]);
  const [ showEditParcelModal, setshowEditParcelModal ] = useState(false);
  const [ editParcel, setEditParcel ] = useState({});
  const [ editImage, setEditImage ] = useState({});


  const fetchCategory = () => {
    Axios.get(`${API_URL}/categories/list`)
    .then(res => {
      setCategoryList( res.data.data )
    })
    .catch(err => {
    })
  }

  const fetchAveragePriceProductCategory = () => {
    Axios.get(`${API_URL}/categories/average`)
    .then(res => {
      setAvgPriceProductCategory( res.data.data )
    })
    .catch(err => {
    })
  }

  const fetchParcel = () => {
    Axios.get(`${API_URL}/parcels/list`)
    .then(res => {
      console.log(res.data)
      setParcelList(res.data.data)
    })
    .catch(err => {
    })
  }

  useEffect(() => {
    fetchParcel();
    fetchCategory();
    fetchAveragePriceProductCategory();
  }, [])

  const handleSelectCategory = (e, index) => {
    const value = e.target.value;
    const name = e.target.name;
    setSelectCategory( 
      selectCategory.map((res,i) => {
        if(i === index){
          return {
            ...res,
            [name]: value
          }
        }else{
          return{
            ...res
          }
        }
      })
    )
  }
  const handleAddCategory = () => {
    setSelectCategory(
      [
        ...selectCategory,
        {
          category: "",
          quantity : ""
        }
      ]
    )
  }
  const handleDeleteCategory = (index) => {
    setSelectCategory(
      selectCategory.filter((res,i) => {
        if(i !== index) return res
      })
    )
    console.log(selectCategory)
  }

  const addInputHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setInputParcel({ ...inputParcel, [name]: value });
  }
  const inputImageHandler = (e) => {
    if(e.target.files[0]){
      setInputImage({ ...inputParcel, imageName: e.target.files[0].name, image: e.target.files[0] });
      let preview = document.getElementById("preview")
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  }

  const editImageHandler = (e) => {
    if(e.target.files[0]){
      setEditImage({ ...editParcel, imageName: e.target.files[0].name, image: e.target.files[0] });
      let preview = document.getElementById("edit_preview")
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  }

  const editParcelHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setEditParcel({ ...editParcel, [name]: value });
  }

  const finalPriceParcel = () => {
    let totalModal = 0
    let totalPriceParcel = 0
    let margin = parseInt(inputParcel.margin)
    // console.log(`selectCategory length :`, selectCategory.length)
    // console.log(`avgPriceProductCategory : `, avgPriceProductCategory)
    // console.log(`avgPriceProductCategory length : `,avgPriceProductCategory.length)
    for(let i=0;i<selectCategory.length;i++){
      console.log(`perulangan i ke ${i}`)
      let id_category_selected = parseInt(selectCategory[i].category)
      let category_quantity_selected = parseInt(selectCategory[i].quantity)
      // console.log(`id_category_selected : `,id_category_selected)
      for(let j=0;j<avgPriceProductCategory.length;j++){
        console.log(`perulangan j ke ${j}`)
        if(id_category_selected === avgPriceProductCategory[j].id_category){
          // console.log(`avgPriceProductCategory : `,avgPriceProductCategory[j].average_price)
          // console.log(`selectCategory quantity : `, category_quantity_selected)
          totalModal = totalModal + (avgPriceProductCategory[j].average_price * category_quantity_selected)
        }
      }
    }
    console.log(`totalModal : `, totalModal)
    totalPriceParcel = totalModal + margin
    console.log(`totalPriceParcel : `, totalPriceParcel)
    return Math.floor(totalPriceParcel)
  }

  const finalEditPriceParcel = () => {
    let totalModal = 0
    let totalPriceParcel = 0
    let margin = parseInt(editParcel.margin)
    console.log(`selectCategory length :`, selectCategory.length)
    console.log(`avgPriceProductCategory : `, avgPriceProductCategory)
    console.log(`avgPriceProductCategory length : `,avgPriceProductCategory.length)
    for(let i=0;i<selectCategory.length;i++){
      console.log(`perulangan i ke ${i}`)
      let id_category_selected = parseInt(selectCategory[i].category)
      let category_quantity_selected = parseInt(selectCategory[i].quantity)
      console.log(`id_category_selected : `,id_category_selected)
      for(let j=0;j<avgPriceProductCategory.length;j++){
        console.log(`perulangan j ke ${j}`)
        if(id_category_selected === avgPriceProductCategory[j].id_category){
          console.log(`avgPriceProductCategory : `,avgPriceProductCategory[j].average_price)
          console.log(`selectCategory quantity : `, category_quantity_selected)
          totalModal = totalModal + (avgPriceProductCategory[j].average_price * category_quantity_selected)
        }
      }
    }
    console.log(`totalModal : `, totalModal)
    totalPriceParcel = totalModal + margin
    console.log(`totalPriceParcel : `, totalPriceParcel)
    return Math.floor(totalPriceParcel)
  }

  const submitAddParcelHandler = () => {
    if(inputImage.image && inputParcel.name && inputParcel.margin && inputParcel.description ){
      let price = finalPriceParcel()
      console.log(price)
      let formData = new FormData();
      let obj = {
        category: selectCategory,
        price,
        ...inputParcel
      }

      console.log(`object:${JSON.stringify(obj)}`)

      formData.append('data', JSON.stringify(obj));
      formData.append('file', inputImage.image)
      Axios.post(`${API_URL}/parcels/add`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
        }
      })
      .then(res => {
        fetchParcel();
        setShowAlert({
          show: true,
          type: "success",
          message: "Add parcel succeed"
        })
      })
      .catch(err => {
        err.response.status === 401 ?
          window.location.replace("/login")
        :
          setShowAlert({
            show: true,
            type: "danger",
            message: err.response.data.data
          })
      });
    }else{
      setShowAlert({
        show: true,
        type: "warning",
        message: "Please fill out all the form!"
      })
    }
  }

  const submitEditParcelHandler = () => {
    console.log(`editParcel :`, editParcel)
    if(editParcel.id && editParcel.image && editParcel.name && editParcel.margin && editParcel.description ){
      let price = finalEditPriceParcel()
      console.log(price)
      let formData = new FormData();
      let obj = {
        category: selectCategory,
        price,
        ...editParcel
      }

      console.log(`object:${JSON.stringify(obj)}`)

      formData.append('data', JSON.stringify(obj));
      formData.append('file', editImage.image)
      Axios.patch(`${API_URL}/parcels/edit`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
        }
      })
      .then(res => {
        fetchParcel();
        setShowAlert({
          show: true,
          type: "success",
          message: "Add parcel succeed"
        })
      })
      .catch(err => {
        err.response.status === 401 ?
          window.location.replace("/login")
        :
          setShowAlert({
            show: true,
            type: "danger",
            message: err.response.data.data
          })
      });
    }else{
      setShowAlert({
        show: true,
        type: "warning",
        message: "Please fill out all the form!"
      })
    }
  }

  const deleteParcelHandler = (id) => {
    console.log(editParcel)
    console.log(`id:${id}`)
    if(id){
      Axios.delete(`${API_URL}/parcels/delete?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
        }
      })
      .then(res => {
        fetchParcel()
        setShowAlert({
          show: true,
          type: "success",
          message: "Delete parcel succeed"
        })
      })
      .catch(err => {
        err.response.status === 401 ?
          window.location.replace("/login")
        :
          setShowAlert({
            show: true,
            type: "danger",
            message: err.response.data.data
          })
      })
    }
  }
  


  const handleShowAddParcel = () => {
    setShowAddParcel(true)
  }

  const handleShowEditParcelModal = (id) => {
    setShowAlert({
      show: false
    })
    parcelList.map((parcel) => {
      if(parcel.id_parcel === id){
        setEditParcel({
          id: parcel.id,
          name: parcel.parcel_name,
          image: parcel.image_parcel,
          margin: parcel.margin,
          description: parcel.description
        })
      }
    })
    setshowEditParcelModal(true)
  }

  const handleCloseAddParcel = () => {
    setEditImage({})
    setShowAlert({
      show: false
    })
    setShowAddParcel(false)
    setSelectCategory(
      []
    )
    setShowAddParcel(false)
  };

  const handleCloseEditParcel = () => {
    setInputImage({})
    setShowAlert({
      show: false
    })
    setEditParcel({})
    setSelectEditCategory(
      []
    )
    setshowEditParcelModal(false)
  };

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
          <img src={`${API_URL}/${params.value}`} height="50px"></img>
        )
      },
      {
        field: 'parcel_name',
        headerName: 'Name',
        headerAlign: 'center',
        width: 200,
      },
      {
        field: 'description',
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
      },
      {
        field: 'id_parcel',
        headerName: 'Action',
        headerAlign: 'center',
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <button onClick={() => handleShowEditParcelModal(params.value)} class="btn btn-primary" style={{marginRight: "10px"}}>Edit</button>
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
        <div className="row">
          <div className="col-md-6">
            <h1>Parcel</h1>
          </div>
          <div className="col-md-6">
            <button 
            className="btn btn-primary btn-right" 
            onClick={handleShowAddParcel}
            disabled={
              categoryList.length > 0 ?
                false
              : true
            }
            >
              Add Parcel
            </button>
          </div>
        </div>
        {renderGrid()}

        <Modal show={showAddParcel} onHide={handleCloseAddParcel}>
          <Modal.Header>
            <Modal.Title>Add Parcel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              showAlert.show ?
                <Alert variant={showAlert.type}>
                  {showAlert.message}
                </Alert>
              : null
            }
            <div className="container" style={
              inputImage.image ?
                {display: 'block'}
              : {display: 'none'}
            }>
              <img id="preview" width="150px"></img>
            </div>
            <label htmlFor="form-email" className="form-label">
              Image
            </label>
            <input
              type="file"
              className="form-control"
              placeholder="Image"
              name="image"
              onChange={inputImageHandler}
            />
            <label htmlFor="form-email" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Parcel Name"
              name="name"
              onChange={addInputHandler}
              value={inputParcel.name}
              required
            />
            <label htmlFor="form-email" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              placeholder="Parcel Description"
              name="description"
              onChange={addInputHandler}
              value={inputParcel.description}
              required
            ></textarea>
            <div className="row">
              <div className="col-md-8">
                <label htmlFor="form-email" className="form-label">
                  Category
                </label>
              </div>
              <div className="col-md-4">
                <label htmlFor="form-email" className="form-label">
                  Quantity
                </label>
              </div>
            </div>
            {
              selectCategory.map((res, index) => {
                return(
                  <div className="row mb-2">
                    <div className="col-md-8">
                      <select class="form-select md-9" aria-label="Default select example" name="category" onChange={(e) => handleSelectCategory(e, index)}>
                        {
                          categoryList.map(category => {
                            return(
                                category.id_category === parseInt(res.category) ?
                                <option value={category.id_category} selected>{category.category}</option>
                              : <option value={category.id_category}>{category.category}</option>
                            )
                          })
                        }
                      </select>
                    </div>
                    <div className="col-md-2">
                      <input 
                        type="number"
                        class="form-control md-3"
                        name="quantity"
                        onChange={(e) => handleSelectCategory(e, index)}
                        value={selectCategory[index].quantity}
                        required
                      />
                    </div>
                    <div class="col-md-2">
                      <button 
                        type="button" 
                        class="btn btn-danger"
                        onClick={() => handleDeleteCategory(index)}
                      >✖️</button>
                    </div>
                  </div>
                )
              })
            }
            <div className="mb-2">
              <button type="button" className="btn btn-primary" onClick={handleAddCategory}>Add Category</button>
            </div>
            <label htmlFor="form-email" className="form-label">
              Margin
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Margin"
              name="margin"
              onChange={addInputHandler}
              value={inputParcel.margin}
              required
            />
            <div className="row">
              <div className="col-md-6">
                <button type="button" onClick={submitAddParcelHandler} className="btn btn-success w-100 mt-3">Add</button>
              </div>
              <div className="col-md-6">
                <button onClick={handleCloseAddParcel} className="btn btn-secondary w-100 mt-3">Close</button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal show={showEditParcelModal} onHide={handleCloseEditParcel}>
          <Modal.Header>
            <Modal.Title>Edit Parcel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              showAlert.show ?
                <Alert variant={showAlert.type}>
                  {showAlert.message}
                </Alert>
              : null
            }
            <div className="container">
              <img src={`${API_URL}/${editParcel.image}`} id="edit_preview" width="150px" style={{display: "inline-block"}}></img>
              <img id="edit_preview" width="150px" style={
              editImage.image ?
                {display: 'inline-block'}
              : {display: 'none'}
              }></img>
            </div>
            <label htmlFor="form-email" className="form-label">
              Image
            </label>
            <input
              type="file"
              className="form-control"
              placeholder="Image"
              name="image"
              onChange={editImageHandler}
            />
            <label htmlFor="form-email" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              name="name"
              onChange={editParcelHandler}
              value={editParcel.name}
              required
            />
            <label htmlFor="form-email" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              placeholder="Product Description"
              name="description"
              onChange={editParcelHandler}
              value={editParcel.description}
              required
            ></textarea>
            <div className="row">
              <div className="col-md-8">
                <label htmlFor="form-email" className="form-label">
                  Category
                </label>
              </div>
              <div className="col-md-4">
                <label htmlFor="form-email" className="form-label">
                  Quantity
                </label>
              </div>
            </div>
            {
              selectCategory.map((res, index) => {
                return(
                  <div className="row mb-2">
                    <div className="col-md-8">
                      <select class="form-select md-9" aria-label="Default select example" name="category" onChange={(e) => handleSelectCategory(e, index)}>
                        {
                          categoryList.map(category => {
                            return(
                                category.id_category === parseInt(res.category) ?
                                <option value={category.id_category} selected>{category.category}</option>
                              : <option value={category.id_category}>{category.category}</option>
                            )
                          })
                        }
                      </select>
                    </div>
                    <div className="col-md-2">
                      <input 
                        type="number"
                        class="form-control md-3"
                        name="quantity"
                        onChange={(e) => handleSelectCategory(e, index)}
                        value={selectCategory[index].quantity}
                        required
                      />
                    </div>
                    <div class="col-md-2">
                      <button 
                        type="button" 
                        class="btn btn-danger"
                        onClick={() => handleDeleteCategory(index)}
                      >✖️</button>
                    </div>
                  </div>
                )
              })
            }
            <div className="mb-2">
              <button type="button" className="btn btn-primary" onClick={handleAddCategory}>Add Category</button>
            </div>

            <label htmlFor="form-email" className="form-label">
              Margin
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Margin"
              name="margin"
              onChange={editParcelHandler}
              value={editParcel.margin}
              required
            />

            <div className="row">
              <div className="col-md-4">
                <button type="button" onClick={submitEditParcelHandler} className="btn btn-success w-100 mt-3">Edit</button>
              </div>
              <div className="col-md-4">
                <button type="button" onClick={() => deleteParcelHandler(editParcel.id)} className="btn btn-danger w-100 mt-3">Delete</button>
              </div>
              <div className="col-md-4">
                <button onClick={handleCloseEditParcel} className="btn btn-secondary w-100 mt-3">Close</button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default Parcels;