import React, { Component } from 'react';
import Title from '../common/page/Title'
import { connect } from '../utils'

class About extends Component {
  constructor(props, context){
    super(props, context)
    this.userStore = this.props.store.user
    this.contentStore = this.props.store.content
    this.routing = this.props.store.routing
  }
  componentDidMount() {
    this.userStore.getStatus()
      .then((status) => {
        this.loadData()
      })
  }

  loadData() {
    this.contentStore.getBlogPost().then((data) => {
      console.log(data)
    })
  }

  render() {
    return (
      <div className="App">
        <Title content="Blog" />
        <section>

        </section>
      </div>
    );
  }
}

export default connect("store")(About);
