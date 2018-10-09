import React, { Component } from 'react';
import Title from '../common/page/Title'
import { connect } from '../utils'
import moment from 'moment'

class About extends Component {
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
      for(const i in items) {
        items[i].need_readmore = items[i].body.length >= 100
        items[i].readmore = false
        items[i].body_stripped = items[i].body.substring(0,100)
        items[i].body_displayed = items[i].body_stripped + ".."
      }

      this.setState({items})
    })
  }

  handleReadmore = (key) => {
    const items = this.state.items
    items[key].readmore = true
    items[key].body_displayed = items[key].body
    this.setState({items})
  }

  handleReadless = (key) => {
    const items = this.state.items
    items[key].readmore = false
    items[key].body_displayed = items[key].body_stripped
    this.setState({items})
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
                  <img className="img-fluid" src={item.image_ref} />
                </div>
                <div className="col">
                  <h2 className="m-0 p-0">{item.title}</h2>
                  <div className="my-3 blog-date">Posted {moment(item.createdAt).format('MMMM DD, YYYY')} by {item.author}</div>
                  <p dangerouslySetInnerHTML={{__html: item.body_displayed}}></p>
                  {item.need_readmore && 
                      <React.Fragment>
                      {item.readmore ?
                        <a className="readmore" onClick={e=>this.handleReadless(key)}>
                        Read less 
                        <i class="fa fa-chevron-up"></i></a>
                        :
                        <a className="readmore" onClick={e=>this.handleReadmore(key)}>
                          Read more 
                          <i class="fa fa-chevron-down"></i></a>
                      }
                    </React.Fragment>
                  }
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
