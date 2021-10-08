import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../../data/API';
import { Modal, Alert } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';

function Products(){
  const [ categoryListWithTotal, setCategoryListWithTotal ] = useState([]);
  const [ categoryList, setCategoryList ] = useState([]);
  const [ productList, setProductList ] = useState([])
  const [ showProductModal, setShowProductModal ] = useState(false);
  const [ showCategoryModal, setShowCategoryModal ] = useState(false);
  const [ showEditCategoryModal, setShowEditCategoryModal ] = useState(false);
  const [ inputProduct, setInputProduct ] = useState({});
  const [ inputImage, setInputImage ] = useState({});
  const [ inputCategory, setInputCategory ] = useState({});
  const [ editCategory, setEditCategory ] = useState({});
  const [ showAlert, setShowAlert ] = useState({});

  const fetchCategory = () => {
    Axios.get(`${API_URL}/categories/list`)
    .then(res => {
      setCategoryList( res.data.data )
    })
    .catch(err => {
      alert("Failed to get category list! Please refresh to try again")
    })
    Axios.get(`${API_URL}/categories/list?type=total`)
    .then(res => {
      setCategoryListWithTotal( res.data.data )
    })
    .catch(err => {
      alert("Failed to get category list! Please refresh to try again")
    })
  }

  const fetchProduct = () => {
    Axios.get(`${API_URL}/products/list`)
    .then(res => {
      setProductList( res.data.data )
    })
    .catch(err => {
      alert("Failed to get products list! Please refresh to try again")
    })
  }

  useEffect(() => {
    fetchCategory();
    fetchProduct();
  }, []);

  const inputProductHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setInputProduct({ ...inputProduct, [name]: value });
  }
  const inputImageHandler = (e) => {
    if(e.target.files[0]){
      setInputImage({ ...inputProduct, imageName: e.target.files[0].name, image: e.target.files[0] });
      let preview = document.getElementById("preview")
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  }
  const addProductHandler = () => {
    if(inputImage.image && inputCategory.name && inputCategory.price && inputCategory.category && inputCategory.quantity){
      let formData = new FormData();
      let obj = {
        ...inputProduct
      }

      formData.append('data', JSON.stringify(obj));
      formData.append('file', inputImage.image)
      Axios.post(`${API_URL}/products/add`, formData)
      .then(res => {
        fetchProduct();
        setShowAlert({
          show: true,
          type: "success",
          message: "Add product succeed"
        })
      })
    }else{
      setShowAlert({
        show: true,
        type: "warning",
        message: "Please fill out all the form!"
      })
    }
  }

  const inputCategoryHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setInputCategory({ ...inputCategory, [name]: value });
  }
  const addCategoryHandler = () => {
    if(inputCategory.name){
      Axios.post(`${API_URL}/categories/add`, inputCategory)
      .then(res => {
        fetchCategory();
        setShowAlert({
          show: true,
          type: "success",
          message: "Add category succeed"
        })
      })
      .catch(err => {
        err.response.data.data === "User not auth!" ?
          <Redirect to="/login" />
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

  const inputEditCategoryHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setEditCategory({ ...editCategory, [name]: value });
  }
  const editCategoryHandler = () => {
    if(editCategory.name && editCategory.id){
      Axios.patch(`${API_URL}/categories/edit`, editCategory)
      .then(res => {
        fetchCategory()
        setShowAlert({
          show: true,
          type: "success",
          message: "Edit category succeed"
        })
      })
      .catch(err => {
        err.response.data.data === "User not auth!" ?
          <Redirect to="/login" />
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
  const deleteCategoryHandler = () => {
    if(editCategory.id){
      Axios.delete(`${API_URL}/categories/delete?id=${editCategory.id}`)
      .then(res => {
        fetchCategory()
        setShowAlert({
          show: true,
          type: "success",
          message: "Delete product succeed"
        })
      })
      .catch(err => {
        err.response.data.data === "User not auth!" ?
          <Redirect to="/login" />
        :
          setShowAlert({
            show: true,
            type: "danger",
            message: err.response.data.data
          })
      })
    }else{
      setShowAlert({
        show: true,
        type: "warning",
        message: "Sorry, something went wrong. Please try again!"
      })
    }
  }

  const handleCloseProductModal = () => {
    setInputImage({})
    setShowAlert({
      show: false
    })
    setShowProductModal(false)
  };
  const handleShowProductModal = () => {
    setShowProductModal(true)
  };

  const handleCloseCategoryModal = () => {
    setShowAlert({
      show: false
    })
    setShowCategoryModal(false)
  };
  const handleShowCategoryModal = () => {
    setShowCategoryModal(true)
  };

  const handleShowEditCategoryModal = (id, name, total) => {
    setEditCategory({
      id,
      name,
      total
    })
    setShowEditCategoryModal(true)
  }
  const handleCloseEditCategoryModal = () => {
    setShowAlert({
      show: false
    })
    setEditCategory({})
    setShowEditCategoryModal(false)
  }

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
        field: 'image_product',
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
        field: 'product_name',
        headerName: 'Name',
        headerAlign: 'center',
        width: 200,
      }, 
      {
        field: 'product_price',
        headerName: 'Price',
        headerAlign: 'center',
        width: 150,
        renderCell: (params) => (
          <>
          Rp {(params.value).toLocaleString()}
          </>
        )
      },
      {
        field: 'category',
        headerName: 'Category',
        headerAlign: 'center',
        width: 150
      }, 
      {
        field: 'product_quantity',
        headerName: 'Quantity',
        headerAlign: 'center',
        width: 150,
        renderCell: (params) => (
          <span class={`badge 
          ${
            params.value === 0 ?
              'alert-danger'
            : params.value < 5 ?
              'alert-warning'
            : 'alert-success'
          }`}>{params.value}</span>
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
        field: 'id_product',
        headerName: 'Action',
        headerAlign: 'center',
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <button class="btn btn-primary" style={{marginRight: "10px"}}>Edit</button>
        )
      }
    ];

    return <DataGrid
      rows={productList} 
      columns={columns} 
      autoHeight
      hideFooterSelectedRowCount
      style={{marginTop: "15px"}}
    />
  }

  return(
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h1>Products</h1>
        </div>
        <div className="col-md-6">
          <button 
          className="btn btn-primary btn-right" 
          onClick={handleShowProductModal}
          disabled={
            categoryList.length > 0 ?
              false
            : true
          }
          >
            Add Product
          </button>
        </div>
      </div>

      <div style={{overFlowY: 'auto', minWidth: '100%'}}>
        <div className="border border-secondary" style={{display: 'inline-block', padding: "2px 10px 2px 10px", minWidth: "60px", marginRight: "7px", borderRadius: "20px", marginBottom: "2px", textAlign: "center"}}>
          All <span class="badge alert-primary">
            {
              categoryListWithTotal.reduce((a, b) => {
                return a + b.total
              }, 0)
            }
          </span>
        </div>
        {
          categoryList.map(category => {
            return (
              <div className="border border-secondary hover-display-parent" style={{display: 'inline-block', padding: "2px 10px 2px 10px", minWidth: "60px", marginRight: "7px", borderRadius: "20px", marginBottom: "2px", textAlign: "center"}}>
                {`${category.category} `}
                {
                  categoryListWithTotal.map(total => 
                    total.total && total.category === category.category ?
                      <>
                      <span class="badge alert-primary">{total.total}</span>
                      <span onClick={() => handleShowEditCategoryModal(category.id_category, category.category, true)} className="hover-display hover-yellow badge badge-pill alert-warning" style={{fontSize: "11px", cursor: "pointer"}}>Edit</span>
                      </>
                    : <span onClick={() => handleShowEditCategoryModal(category.id_category, category.category, false)} className="hover-display hover-yellow badge badge-pill alert-warning" style={{fontSize: "11px", cursor: "pointer"}}>Edit</span>
                  )
                }
              </div>
            )
          })
        }
        <button onClick={handleShowCategoryModal} className="btn border border-secondary" style={{display: 'inline-block', padding: "2px 10px 2px 10px", minWidth: "60px", marginRight: "7px", borderRadius: "20px", marginBottom: "2px", textAlign: "center"}}>
          Add Category
        </button>
      </div>
      
      {renderGrid()}

      <Modal show={showCategoryModal} onHide={handleCloseCategoryModal}>
        <Modal.Header>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            showAlert.show ?
              <Alert variant={showAlert.type}>
                {showAlert.message}
              </Alert>
            : null
          }
          <label htmlFor="form-email" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Product Name"
            name="name"
            onChange={inputCategoryHandler}
            value={inputCategory.name}
            required
          />
          <div className="row">
            <div className="col-md-6">
              <button type="button" onClick={addCategoryHandler} className="btn btn-success w-100 mt-3">Add</button>
            </div>
            <div className="col-md-6">
              <button onClick={handleCloseCategoryModal} className="btn btn-secondary w-100 mt-3">Close</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showEditCategoryModal} onHide={handleCloseEditCategoryModal}>
        <Modal.Header>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            showAlert.show ?
              <Alert variant={showAlert.type}>
                {showAlert.message}
              </Alert>
            : null
          }
          <label htmlFor="form-email" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Product Name"
            name="name"
            onChange={inputEditCategoryHandler}
            value={editCategory.name}
            required
          />
          <div className="row">
            {
              editCategory.total ?
                <>
                <div className="col-md-6">
                  <button type="button" onClick={editCategoryHandler} className="btn btn-success w-100 mt-3">Edit</button>
                </div>
                <div className="col-md-6">
                  <button onClick={handleCloseEditCategoryModal} className="btn btn-secondary w-100 mt-3">Close</button>
                </div>
                </>
              :
                <>
                <div className="col-md-4">
                  <button type="button" onClick={editCategoryHandler} className="btn btn-success w-100 mt-3">Edit</button>
                </div>
                <div className="col-md-4">
                  <button type="button" onClick={deleteCategoryHandler} className="btn btn-danger w-100 mt-3">Delete</button>
                </div>
                <div className="col-md-4">
                  <button onClick={handleCloseEditCategoryModal} className="btn btn-secondary w-100 mt-3">Close</button>
                </div>
                </>
            }
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showProductModal} onHide={handleCloseProductModal}>
        <Modal.Header>
          <Modal.Title>Add Product</Modal.Title>
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
            required
          />
          <label htmlFor="form-email" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Product Name"
            name="name"
            onChange={inputProductHandler}
            value={inputProduct.name}
            required
          />
          <label htmlFor="form-email" className="form-label">
            Category
          </label>
          <select class="form-select" aria-label="Default select example" name="category" onChange={inputProductHandler}>
            {
              categoryList.map(category => {
                return <option value={category.id_category}>{category.category}</option>
              })
            }
          </select>
          <label htmlFor="form-email" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="Product Price"
            name="price"
            onChange={inputProductHandler}
            value={inputProduct.price}
            required
          />
          <label htmlFor="form-email" className="form-label">
            Quantity
          </label>
          <input
            type="number"
            className="form-control"
            placeholder="Product Quantity"
            name="quantity"
            onChange={inputProductHandler}
            value={inputProduct.quantity}
            required
          />
          <div className="row">
            <div className="col-md-6">
              <button type="button" onClick={addProductHandler} className="btn btn-success w-100 mt-3">Add</button>
            </div>
            <div className="col-md-6">
              <button onClick={handleCloseProductModal} className="btn btn-secondary w-100 mt-3">Close</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Products;