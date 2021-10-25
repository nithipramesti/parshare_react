import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";
import Axios from 'axios';
import { API_URL } from '../../data/API';
import { Modal, Alert } from 'react-bootstrap';
import { GridOverlay, DataGrid } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';
import image from '../../assets/images/default-product.png';

function Products(){
  const authReducer = useSelector((state) => state.authReducer);

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
  const [ showEditProductModal, setShowEditProductModal ] = useState(false);
  const [ editProduct, setEditProduct ] = useState({});
  const [ editImage, setEditImage ] = useState({});
  const [ selectCategory, setSelectCategory ] = useState(0);

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

  const fetchProduct = (id) => {
    Axios.get(`${API_URL}/products/list?id=${id}`)
    .then(res => {
      setProductList( res.data.data )
    })
    .catch(err => {
      alert("Failed to get products list! Please refresh to try again")
    })
  }

  useEffect(() => {
    fetchCategory();
    fetchProduct("all");
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
    if(inputImage.image && inputProduct.name && inputProduct.price && inputProduct.category && inputProduct.quantity && inputProduct.description) {
      let formData = new FormData();
      let obj = {
        ...inputProduct
      }

      formData.append('data', JSON.stringify(obj));
      formData.append('file', inputImage.image)
      Axios.post(`${API_URL}/products/add`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
        }
      })
      .then(res => {
        fetchProduct("all");
        setShowAlert({
          show: true,
          type: "success",
          message: "Add product succeed"
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
  const editImageHandler = (e) => {
    if(e.target.files[0]){
      setEditImage({ ...editProduct, imageName: e.target.files[0].name, image: e.target.files[0] });
      let preview = document.getElementById("edit_preview")
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  }
  const editProductHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setEditProduct({ ...editProduct, [name]: value });
  }
  const submitEditProductHandler = () => {
    if(editProduct.id && editProduct.name && editProduct.price && editProduct.category && editProduct.description && editProduct.quantity && editProduct.image && editImage.image){
      let formData = new FormData();
      let obj = {
        ...editProduct
      }

      formData.append('data', JSON.stringify(obj));
      formData.append('file', editImage.image);
      Axios.patch(`${API_URL}/products/edit`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
        }
      })
      .then(res => {
        setEditImage({});
        fetchProduct("all");
        setShowAlert({
          show: true,
          type: "success",
          message: "Edit product succeed"
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
    }else if(editProduct.id && editProduct.name && editProduct.price && editProduct.category && editProduct.description && editProduct.quantity && editProduct.image){
      let formData = new FormData();
      let obj = {
        ...editProduct
      }
      delete obj.image;

      formData.append('data', JSON.stringify(obj));
      Axios.patch(`${API_URL}/products/edit`, obj, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
        }
      })
      .then(res => {
        fetchProduct("all");
        setShowAlert({
          show: true,
          type: "success",
          message: "Edit product succeed"
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
  const deleteProductHandler = (id) => {
    if(id){
      Axios.delete(`${API_URL}/products/delete?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
        }
      })
      .then(res => {
        fetchProduct("all")
        setShowAlert({
          show: true,
          type: "success",
          message: "Delete product succeed"
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

  const inputCategoryHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setInputCategory({ ...inputCategory, [name]: value });
  }
  const addCategoryHandler = () => {
    if(inputCategory.name){
      Axios.post(`${API_URL}/categories/add`, inputCategory, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
        }
      })
      .then(res => {
        fetchCategory();
        setShowAlert({
          show: true,
          type: "success",
          message: "Add category succeed"
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

  const inputEditCategoryHandler = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setEditCategory({ ...editCategory, [name]: value });
  }
  const editCategoryHandler = () => {
    if(editCategory.name && editCategory.id){
      Axios.patch(`${API_URL}/categories/edit`, editCategory, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
        }
      })
      .then(res => {
        fetchCategory()
        fetchProduct("all")
        setShowAlert({
          show: true,
          type: "success",
          message: "Edit category succeed"
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
  const deleteCategoryHandler = () => {
    if(editCategory.id){
      Axios.delete(`${API_URL}/categories/delete?id=${editCategory.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token_parshare")}`
        }
      })
      .then(res => {
        fetchCategory()
        setShowAlert({
          show: true,
          type: "success",
          message: "Delete category succeed"
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
    }else{
      setShowAlert({
        show: true,
        type: "warning",
        message: "Sorry, something went wrong. Please try again!"
      })
    }
  }

  const selectCategoryHandler = (id) => {
    setProductList([])
    console.log("CLICK"+id)
    setSelectCategory(id)
    if(id === 0){
      id = "all"
    }
    fetchProduct(id)
  }
  const handleCloseProductModal = () => {
    setInputImage({})
    setShowAlert({
      show: false
    })
    setShowProductModal(false)
  };
  const handleShowProductModal = () => {
    setInputProduct({})
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
      name
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

  const CustomLoadingOverlay = () => {
    return (
      <GridOverlay>
        <div style={{ position: 'absolute', top: 0, width: '100%' }}>
          <LinearProgress />
        </div>
      </GridOverlay>
    )
  }
  const handleShowEditProductModal = (id) => {
    setShowAlert({
      show: false
    })
    productList.map((product) => {
      if(product.id_product === id){
        setEditProduct({
          id: product.id_product,
          name: product.product_name,
          description: product.description,
          price: product.product_price,
          image: product.image_product,
          category: product.id_category,
          quantity: product.product_quantity,
        })
      }
    })
    setShowEditProductModal(true)
  }
  const handleCloseEditProductModal = () => {
    setShowAlert({
      show: false
    })
    setEditImage({})
    setEditProduct({})
    setShowEditProductModal(false)
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
        field: 'description',
        headerName: 'Description',
        headerAlign: 'center',
        width: 400,
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
          <button onClick={() => handleShowEditProductModal(params.value)} class="btn btn-primary" style={{marginRight: "10px"}}>Edit</button>
        )
      }
    ];

    let loading = true;
    if(productList.length > 0) {
      loading = false;
    }

    return <DataGrid
      rows={productList} 
      columns={columns}
      components={{
        LoadingOverlay: CustomLoadingOverlay,
      }}
      loading={loading}
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
          <div className="border border-secondary" onClick={() => selectCategoryHandler(0)} style={
            selectCategory === 0 ?
              {cursor: "pointer", background: "#041E43", color: "#fff", display: 'inline-block', padding: "2px 10px 2px 10px", minWidth: "60px", marginRight: "7px", borderRadius: "20px", marginBottom: "2px", textAlign: "center"}
            : {cursor: "pointer", background: "#fff", color: "#000", display: 'inline-block', padding: "2px 10px 2px 10px", minWidth: "60px", marginRight: "7px", borderRadius: "20px", marginBottom: "2px", textAlign: "center"}
          }>
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
                <div className="border border-secondary hover-display-parent" onClick={() => selectCategoryHandler(category.id_category)} style={
                  category.id_category === selectCategory ?
                    {cursor: "pointer", background: "#041E43", color: "#fff", display: 'inline-block', padding: "2px 10px 2px 10px", minWidth: "60px", marginRight: "7px", borderRadius: "20px", marginBottom: "2px", textAlign: "center"}
                  : {cursor: "pointer", background: "#fff", color: "#000", display: 'inline-block', padding: "2px 10px 2px 10px", minWidth: "60px", marginRight: "7px", borderRadius: "20px", marginBottom: "2px", textAlign: "center"}
                  }>
                  {`${category.category} `}
                  {
                    categoryListWithTotal.map(total => 
                      total.total > 0 && total.id_category === category.id_category ?
                        <>
                        <span class="badge alert-primary">{total.total}</span>
                        </>
                      : null
                    )
                  }
                  <span onClick={() => handleShowEditCategoryModal(category.id_category, category.category, true)} className="hover-display hover-yellow badge badge-pill alert-warning" style={{fontSize: "11px", cursor: "pointer"}}>Edit</span>
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
              placeholder="Category Name"
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
              placeholder="Category Name"
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
                  <div className="col-md-6">
                    <button type="button" onClick={editCategoryHandler} className="btn btn-success w-100 mt-3">Edit</button>
                  </div>
                  <div className="col-md-6">
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
            <div className="row">
              <div className="col-md-2">
                <img id="preview" style={
                  inputImage.image ?
                    {display: 'inline-block', height: "140px", width: "140px"}
                  : {display: 'none'}
                }></img>
                <img src={image} style={
                  !inputImage.image ?
                    {display: 'inline-block', height: "140px", width: "140px"}
                  : {display: 'none'}
                }></img>
              </div>
              <div className="col-md-10">
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
              </div>
            </div>
            <label htmlFor="form-email" className="form-label">
              Description
            </label>
            <textarea className="form-control" name="description" onChange={inputProductHandler}></textarea>
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

        <Modal show={showEditProductModal} onHide={handleCloseEditProductModal}>
          <Modal.Header>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              showAlert.show ?
                <Alert variant={showAlert.type}>
                  {showAlert.message}
                </Alert>
              : null
            }
            <div className="row">
              <div className="col-md-2">
                <img src={`${API_URL}/${editProduct.image}`} style={
                  editImage.image ?
                  {display: 'none'}
                  : {display: 'inline-block', height: "140px", width: "140px"}
                  }></img>
                <img id="edit_preview" style={
                editImage.image ?
                  {display: 'inline-block', height: "140px", width: "140px"}
                : {display: 'none'}
                }></img>
              </div>
              <div className="col-md-10">
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
                  onChange={editProductHandler}
                  value={editProduct.name}
                  required
                />
              </div>
            </div>
            <label htmlFor="form-email" className="form-label">
              Description
            </label>
            <textarea className="form-control" name="description" onChange={editProductHandler}>{editProduct.description}</textarea>
            <label htmlFor="form-email" className="form-label">
              Category
            </label>
            <select class="form-select" aria-label="Default select example" name="category" onChange={editProductHandler}>
              {
                categoryList.map(category => 
                  category.id_category === editProduct.category ? 
                    <option value={category.id_category} selected>{category.category}</option>
                  : <option value={category.id_category}>{category.category}</option>
                )
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
              onChange={editProductHandler}
              value={editProduct.price}
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
              onChange={editProductHandler}
              value={editProduct.quantity}
              required
            />
            <div className="row">
              <div className="col-md-4">
                <button type="button" onClick={submitEditProductHandler} className="btn btn-success w-100 mt-3">Edit</button>
              </div>
              <div className="col-md-4">
                <button type="button" onClick={() => deleteProductHandler(editProduct.id)} className="btn btn-danger w-100 mt-3">Delete</button>
              </div>
              <div className="col-md-4">
                <button onClick={handleCloseEditProductModal} className="btn btn-secondary w-100 mt-3">Close</button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default Products;