import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Paper';
import Title from '../common/page/Title'
import {connect} from '../utils';
import { CSVLink, CSVDownload } from 'react-csv';
import axios from 'axios'


class ManageProducts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      productListData: "",
      categoryListData: ""

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
     //this.adminStore.getProductSelectionDownload()
    await axios.get(`http://localhost:4001/api/admin/products/currentselectioncsv`)
      .then( res => { 
      this.setState({
        productListData: res.data
      })
    })
  }

  async onDownloadProductCategoriesClick() {
    //this.adminStore.getProductCategoriesDownload()
    await axios.get(`http://localhost:4001/api/admin/products/currentcategoriescsv`)
      .then( res => { 
      this.setState({
        categoryListData: res.data
      })
    })
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
                <Button>
                  <CSVLink data={productListData} onClick={() => this.onDownloadProductListingClick()}>
                    Download Product Listing
                  </CSVLink>
                </Button>
              </div>
              <div className="product-selection-button">
                <Button>
                  <CSVLink data={categoryListData} onClick={() => this.onDownloadProductCategoriesClick()}>
                    Download Categories Listing
                  </CSVLink>
                </Button>
              </div>
            </div>
            <div className="product-selection-upload">
              <h3>Upload</h3>
              <div className="product-selection-button">
                <Button>Upload New FBW</Button>
              </div>
              <div className="product-selection-button">
                <Button>Upload Existing FBW</Button>
              </div>
              <div className="product-selection-button">
                <Button>Upload New Non-FBW</Button>
              </div>
              <div className="product-selection-button">
                <Button>Upload Existing Non-FBW</Button>
              </div>
              <div className="product-selection-upload-image-button">
                <Button>Upload Images</Button>
              </div>
            </div>
            
          </div>

          </Paper>
      </div>
    )

  }
}

export default connect("store")(ManageProducts);



