import React, { Component } from 'react';
import Title from '../common/page/Title'
import { connect } from '../utils'
import moment from 'moment'

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
          <div className="container mt-5">
            { this.contentStore.blog.map((item) => (
              <div className="row blog-item">
                <div className="col">
                  <img className="img-fluid" src={item.image_ref} />
                </div>
                <div className="col">
                  <h2 className="m-0 p-0">{item.title}</h2>
                  <div className="my-3 blog-date">Posted {moment(item.createdAt).format('MMMM DD, YYYY')} by {item.author}</div>
                  <p dangerouslySetInnerHTML={{__html: item.body}}>
                  </p>
                </div>
                <hr/>
              </div>
            ))}
          </div>

        </section>
      </div>
    );
  }
}

export default connect("store")(About);
