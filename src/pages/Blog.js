import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Title from '../common/page/Title'
import { connect } from '../utils'
import moment from 'moment'

class Blog extends Component {
  constructor(props, context){
    super(props, context)

    this.state = {
      items: []
    }

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
      for(const i in items) {
        items[i].need_readmore = items[i].body.length >= 150
        items[i].readmore = false
        items[i].body_stripped = items[i].body.substring(0,150)
        items[i].body_displayed = items[i].body_stripped + "..."
      }

      this.setState({items})
    })
  }

  render() {
    return (
      <div className="App">
        <Title content="Blog" />
        <section>
          <div className="container mt-5">
            { this.state.items.map((item, key) => (
              <div className="row blog-item" key={key}>
                <div className="col">
                  <img className="img-fluid" src={item.image_ref} alt="" />
                </div>
                <div className="col">
                  <h2 className="m-0 p-0">
                    <Link to={`/blog/${item._id}`}>{item.title}</Link>
                  </h2>
                  <div className="my-3 blog-date">Posted {moment.utc(item.post_date).format('MMMM DD, YYYY')} by {item.author}</div>
                  <p dangerouslySetInnerHTML={{__html: item.body_displayed}}></p>
                  <Link to={`/blog/${item._id}`} className="readmore">Read more &nbsp;<i className="fa fa-chevron-right"></i></Link>
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

export default connect("store")(Blog);
