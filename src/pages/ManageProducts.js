import React, { Component } from 'react'
import { Message } from 'semantic-ui-react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import Title from '../common/page/Title'
import {connect} from '../utils';
import { CSVLink } from 'react-csv';
import axios from 'axios'


class ManageProducts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      productListData: "",
      categoryListData: "",
      file: null,
      errors: [],
      loading: false
    }
    this.userStore = props.store.user
    this.adminStore = props.store.admin
  }
  
  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (
          status &&
          (user.type === 'admin' ||
          user.type === 'super-admin' ||
          user.type === 'tws-ops')
        ) {
          this.onDownloadProductListingClick()
          this.onDownloadProductCategoriesClick()
        } else {
          this.props.store.routing.push('/')
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/')
      })
  }

  onDownloadProductListingClick() {
     //this.adminStore.getProductSelectionDownload() ... when done with testing.
    axios.get(`http://localhost:4001/api/admin/products/currentselectioncsv`)
      .then( res => { 
      this.setState({
        productListData: res.data
      })
    })
  }

  onDownloadProductCategoriesClick() {
    //this.adminStore.getProductCategoriesDownload() ... when done with testing.
    axios.get(`http://localhost:4001/api/admin/products/currentcategoriescsv`)
      .then( res => { 
      this.setState({
        categoryListData: res.data
      })
    })
  }

  onUploadNewFBW = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true})
      const formData = new FormData();
      formData.append('file', this.state.file[0])
      let fbw = true, type="new", fileName = this.state.file[0].name
      axios.post(`http://localhost:4001/api/admin/products/selectionupload?fbw=${fbw}&type=${type}&filename=${fileName}`, formData, { headers : { 'Content-Type': 'multipart/form-data'}})
        .then( res => { 
        this.setState({
          loading: false,
          file: null
         })
      }).catch(error => {
        this.setState({
          errors: this.state.errors.concat(error.response.data),
          file: null
        })
      })
    } else {
        this.setState({
          errors: this.state.errors.concat("Please add a CSV file."),
          loading: false,
        })
    }
  }

  onUploadExistingFBW = (event) => {
    event.preventDefault();
    if(this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true})
      const formData = new FormData(); 
      formData.append('file', this.state.file[0])
      let fbw = true, type="existing", fileName = this.state.file[0].name
      console.log(this.state.file[0]) 
      axios.post(`http://localhost:4001/api/admin/products/selectionupload?fbw=${fbw}&type=${type}&filename=${fileName}`, formData, { headers : { 'Content-Type': 'multipart/form-data'}})
        .then( res => { 
        console.log(res)
        this.setState({
          loading: false,
          file: null
         })
      }).catch(error => {
        this.setState({
          errors: this.state.errors.concat(error.response.data),
          loading: false,
         })
      })
    } else {
      this.setState({
        errors: this.state.errors.concat("Please add a CSV file."),
      })
    }
  }

  onUploadNewNonFBW = (event) => {
    event.preventDefault();
    if(this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true})
      const formData = new FormData(); 
      formData.append('file', this.state.file[0])
      let fbw = false, type="new", fileName = this.state.file[0].name
      console.log(this.state.file[0]) 
      axios.post(`http://localhost:4001/api/admin/products/selectionupload?fbw=${fbw}&type=${type}&filename=${fileName}`, formData, { headers : { 'Content-Type': 'multipart/form-data'}})
        .then( res => { 
        console.log(res)
        this.setState({
          loading: false,
          file: null
         })
      }).catch(error => {
        this.setState({
          errors: this.state.errors.concat(error.response.data),
          loading: false,
          file: null
         })
      })
    } else {
      this.setState({
        errors: this.state.errors.concat("Please add a CSV file.")
      })
    }
  }

  onUploadExistingNonFBW = (event) => {
    event.preventDefault();
    if(this.isFormValid(this.state)) {
      const formData = new FormData(); 
      formData.append('file', this.state.file[0])
      let fbw = false, type="existing", fileName = this.state.file[0].name
      console.log(this.state.file[0]) 
      axios.post(`http://localhost:4001/api/admin/products/selectionupload?fbw=${fbw}&type=${type}&filename=${fileName}`, formData, { headers : { 'Content-Type': 'multipart/form-data'}})
        .then( res => { 
        console.log(res)
        this.setState({
          loading: false,
          file: null
         })
      }).catch(error => {
        this.setState({
          errors: this.state.errors.concat(error.response.data),
          loading: false,
          file: null
         })
      })
    } else {
      this.setState({
        errors: this.state.errors.concat("Please add a CSV file.")
      })
    }
  }

  onUploadProductImages = (event) => {
    event.preventDefault();
    if(this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true})
      const formData = new FormData(); 
      formData.append('file', this.state.file[0])
      console.log(this.state.file[0])
      axios.post(`http://localhost:4001/api/admin/products/imagesupload`, formData, { headers : { 'Content-Type': 'multipart/form-data'}})
        .then( res => { 
        console.log(res)
        this.setState({
          loading: false,
          file: null
         })
      }).catch(error => {
        this.setState({
         errors: this.state.errors.concat(error.response.data),
         loading: false,
         file: null
        })
      })
    } else {
      this.setState({
        errors: this.state.errors.concat("Please add a zip file of images.")
      })
    }
  }


  handleFileUpload = (event) => {
    this.setState({file: event.target.files});
  }

  isFormValid = ({ file }) => file;

  displayErrors = errors => <p style={{ fontSize: '1.25em', color: 'red'}}>{errors[errors.length - 1]}</p>

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.toLowerCase().includes(inputName)) ?
    'error'
    :
    " "
  }


  render () {
    if (!this.userStore.user) return null
    const { productListData, categoryListData, errors, loading } = this.state

    return (
      <div>
        <Title content="Upload Product Selection"/>
          <Paper className="product-selection-container" style={{backgroundColor: '#faf5ee'}}>
          <div className="product-selection-container-inner" style={{backgroundColor: '#ffffff'}}>
            <div className="product-selection-download">
              
              <h3>Download</h3>
              <div className="product-selection-button">
                <Button size="medium" style={{ textTransform: 'none'}} >
                  <CSVLink style={{color:'black', textDecoration: 'none'}} data={productListData} onClick={() => this.onDownloadProductListingClick()}>
                    Download Product Listing
                  </CSVLink>
                </Button>
              </div>
              <div className="product-selection-button">
                <Button size="medium" style={{ textTransform: 'none'}}>
                  <CSVLink style={{color:'black', textDecoration: 'none'}} data={categoryListData} onClick={() => this.onDownloadProductCategoriesClick()}>
                    Download Categories Listing
                  </CSVLink>
                </Button>
              </div>
            </div>
            <div className="product-selection-upload">
              { errors.length > 0 && (
                <div style={{marginTop: '-2.5%'}}>
                { this.displayErrors(errors)} 
                </div>
              )}
              <h3>Upload</h3>
              
              <div className="product-selection-button">
                <form onSubmit={this.onUploadNewFBW} className={this.handleInputError(errors, 'file')} >
                  <input type="file" id="file" onChange={this.handleFileUpload} />
                  <Button disabled={loading} className={loading ? 'loading':''}  style={{ textTransform: 'none'}} size="medium" type="submit">Upload New FBW</Button>
                </form>
              </div>
              <div className="product-selection-button">
                <form onSubmit={this.onUploadExistingFBW} className={this.handleInputError(errors, 'file')} >
                  <input type="file" id="file" onChange={this.handleFileUpload} />
                  <Button disabled={loading} className={loading ? 'loading':''}  style={{ textTransform: 'none'}} size="medium" type="submit">Upload Existing FBW</Button>
                </form>
              </div>
              <div className="product-selection-button">
                <form onSubmit={this.onUploadNewNonFBW} >
                  <input type="file" id="file" onChange={this.handleFileUpload}  className={this.handleInputError(errors, 'file')}/>
                  <Button disabled={loading} className={loading ? 'loading':''}  style={{ textTransform: 'none'}} size="medium" type="submit">Upload New Non-FBW</Button>
                </form>
              </div>
              <div className="product-selection-button">
                <form onSubmit={this.onUploadExistingNonFBW} >
                  <input type="file" id="file" onChange={this.handleFileUpload} className={this.handleInputError(errors, 'file')}/>
                  <Button disabled={loading} className={loading ? 'loading':''}  style={{ textTransform: 'none'}} size="medium" type="submit">Upload Existing Non-FBW</Button>
                </form>
              </div>
              <div className="product-selection-upload-image-button">
                <form onSubmit={this.onUploadProductImages} >
                  <input type="file" id="file" onChange={this.handleFileUpload} className={this.handleInputError(errors, 'file')} />
                  <Button disabled={loading} className={loading ? 'loading':''} style={{ textTransform: 'none'}} size="medium" type="submit">Upload Images</Button>
                </form>
              </div>
            </div>
          </div>
          </Paper>
      </div>
    )

  }
}

export default connect("store")(ManageProducts);



