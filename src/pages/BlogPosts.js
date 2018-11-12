import React, { Component } from 'react';
import Title from '../common/page/Title'
import { connect } from '../utils'
import moment from 'moment'
import {Link} from "react-router-dom";

class BlogPosts extends Component {
  state = {
    items: []
  }
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
    this.contentStore.getBlogPost().then((items) => {
      this.setState({items})
    })
  }

  render() {
    return (
      <div className="App">
        <Title content="Blog posts" />
        <section>
          <div className="container mt-5 blog-posts-images">
            { this.state.items.map((item, key) => (
              <div className="blog-post-item" key={key}>
                <Link to={`${item._id}`}>
                <img className="img-fluid" src={item.image_ref} alt="" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(BlogPosts);
