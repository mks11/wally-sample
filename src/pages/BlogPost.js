import React, { Component } from 'react';
import Title from '../common/page/Title'
import { Row, Col } from 'reactstrap';
import { connect } from '../utils'
import moment from 'moment'

class BlogPost extends Component {
  constructor(props, context){
    super(props, context)

    this.state = {
      item: null
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
    const id = this.props.match.params.id

    this.contentStore.getBlogPost().then((items) => {
      const item = items.filter(item => item._id === id)[0]
      this.setState({ item })
    })
  }

  render() {
    const id = this.props.match.params.id
    const { item } = this.state

    if (!id || !item) {
      return null
    }

    return (
      <div className="App">
        <Title content="Blog" />
        <section>
          <div className="container mt-5">
            <Row className="blog-item blog-post">
              <Col>
                <Row>
                  <Col>
                    <img className="img-fluid" src={item.image_ref} alt="" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h2 className="m-0 p-0">{item.title}</h2>
                    <div className="my-3 blog-date">Posted {moment.utc(item.post_date).format('MMMM DD, YYYY')} by {item.author}</div>
                    <p dangerouslySetInnerHTML={{__html: item.body}}></p>
                  </Col>
                </Row>
              </Col>
              <hr/>
            </Row>
          </div>

        </section>
      </div>
    );
  }
}

export default connect("store")(BlogPost);
