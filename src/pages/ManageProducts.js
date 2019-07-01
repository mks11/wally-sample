import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
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
      file: null
    }
    this.userStore = props.store.user
    this.adminStore = this.props.store.admin
  }
  
  componentDidMount() {
    console.log('user type', this.userStore.user.type)
    this.userStore.getStatus(true)
      .then(status => {
        const user = this.userStore.user
          if (!status || !['admin', 'super-admin'].includes(user.type) ) {
            this.props.store.routing.push('/')
          } 
      })
      .catch( error => {
        this.props.store.routing.push('/')
      })
    this.onDownloadProductListingClick()
    this.onDownloadProductCategoriesClick()
  }

  async onDownloadProductListingClick() {
     //this.adminStore.getProductSelectionDownload() ... when done with testing.
    await axios.get(`http://localhost:4001/api/admin/products/currentselectioncsv`)
      .then( res => { 
      this.setState({
        productListData: res.data
      })
    })
  }

  async onDownloadProductCategoriesClick() {
    //this.adminStore.getProductCategoriesDownload() ... when done with testing.
    await axios.get(`http://localhost:4001/api/admin/products/currentcategoriescsv`)
      .then( res => { 
      this.setState({
        categoryListData: res.data
      })
    })
  }

   onUploadNewFBWSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', this.state.file[0])
    const fbw = false , type="new", fileName = this.state.file[0].name.split(".csv")[0]
    console.log(this.state.file[0]) 
    axios.post(`http://localhost:4001/api/admin/products/selectionupload?fbw=${fbw}&type=${type}&filename=${fileName}`, formData, { headers : { 'Content-Type': 'multipart/form-data'}})
      .then( res => { 
      console.log(res)
    }).catch(error => {
      console.log(error)
    })
  }

  handleFileUpload = (event) => {
    this.setState({file: event.target.files});
  }


  render () {
    if (!this.userStore.user) return null
    const { productListData, categoryListData } = this.state

    return (
      <div>
        <Title content="Upload Product Selection"/>
          <Paper className="product-selection-container" style={{backgroundColor: '#faf5ee'}}>
          <div className="product-selection-container-inner" style={{backgroundColor: '#ffffff'}}>
            <div className="product-selection-download">
              <h3>Download</h3>
              <div className="product-selection-button">
                <Button size="small" style={{ textTransform: 'none'}} >
                  <CSVLink data={productListData} onClick={() => this.onDownloadProductListingClick()}>
                    Download Product Listing
                  </CSVLink>
                </Button>
              </div>
              <div className="product-selection-button">
                <Button size="small" style={{ textTransform: 'none'}}>
                  <CSVLink data={categoryListData} onClick={() => this.onDownloadProductCategoriesClick()}>
                    Download Categories Listing
                  </CSVLink>
                </Button>
              </div>
            </div>
            <div className="product-selection-upload">
              <h3>Upload</h3>
              <div className="product-selection-button">
                <form onSubmit={this.onUploadNewFBWSubmit} >
                  <input type="file" id="file" onChange={this.handleFileUpload} />
                  <Button style={{ textTransform: 'none'}} size="small" type="submit">Upload New FBW</Button>
                </form>
              </div>
              <div className="product-selection-button">
                <form onSubmit={this.onUploadNewFBWSubmit} >
                  <input type="file" id="file" onChange={this.handleFileUpload} />
                  <Button style={{ textTransform: 'none'}} size="small" type="submit">Upload Existing FBW</Button>
                </form>
              </div>
              <div className="product-selection-button">
                <form onSubmit={this.onUploadNewFBWSubmit} >
                  <input type="file" id="file" onChange={this.handleFileUpload} />
                  <Button style={{ textTransform: 'none'}} size="small" type="submit">Upload New Non-FBW</Button>
                </form>
              </div>
              <div className="product-selection-button">
                <form onSubmit={this.onUploadNewFBWSubmit} >
                  <input type="file" id="file" onChange={this.handleFileUpload} />
                  <Button style={{ textTransform: 'none'}} size="small" type="submit">Upload Existing Non-FBW</Button>
                </form>
              </div>
              <div className="product-selection-upload-image-button">
                <form onSubmit={this.onUploadNewFBWSubmit} >
                  <input type="file" id="file" onChange={this.handleFileUpload} />
                  <Button style={{ textTransform: 'none'}} size="small" type="submit">Upload Images</Button>
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



