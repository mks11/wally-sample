import React, { Component } from 'react'
import Container from 'reactstrap'
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Paper';
import Title from '../common/page/Title'
import {connect} from '../utils';




class ManageProducts extends Component {
  constructor(props) {
    super(props)
    this.userStore = props.store.user
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
  }

  render () {
    if (!this.userStore.user) return null
    return (
      <div>
        <Title content="Upload Product Selection"/>
          <Paper className="product-selection-container" style={{backgroundColor: '#faf5ee'}}>
          <div className="product-selection-container-inner" style={{backgroundColor: '#ffffff'}}>
            <div className="product-selection-download">
              <h3>Download</h3>
              <div className="product-selection-button">
                <Button>Download Product Listing</Button>
              </div>
              <div className="product-selection-button">
                <Button>Download Categories</Button>
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



