import React, { Component } from 'react'
import Container from 'reactstrap'
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Title from '../common/page/Title'
import {connect} from '../utils';
import 'semantic-ui-css';



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
          <Paper style={{ backgroundColor: '#FAF5EE', padding: "2em", margin: 'auto', height: '50vh', width: '50vw'}}>
          <div style={{ backgroundColor: 'white', height: '100%', width: '100%', borderRadius: '2%'}}>
            <div style={{ backgroundColor: '#eee', width: '100%', height:'50%', textAlign: 'center', padding: "1em" }}>
              <h3>Download</h3>

            </div>
            <div style={{ backgroundColor: '#eef', width: '100%', height:'50%', textAlign: 'center', padding: "1em" }}>
              <h3>Upload</h3>

            </div>
          </div>
          </Paper>
      </div>
    )

  }
}

export default connect("store")(ManageProducts);



