import React, { Component } from 'react'
import {
  Row,
  Col,
  Container,
  Button,
} from 'reactstrap'

import Title from '../common/page/Title'
import ManageTabs from './manage/ManageTabs'
import BlogPostEditor from './manage/BlogPostEditor'
import moment from 'moment';

import { connect } from '../utils'

class ManageBlog extends Component {
  constructor(props) {
    super(props)

    this.state = {
      postEditId: null
    }

    this.userStore = this.props.store.user
    this.adminStore = this.props.store.admin
    this.contentStore = this.props.store.content
  }

  componentDidMount() {
    this.userStore.getStatus(true)
      .then((status) => {
        const user = this.userStore.user
        if (!status || user.type !== 'admin') {
          this.props.store.routing.push('/')
        } else {
          this.loadBlogPosts()
        }
      })
      .catch((error) => {
        this.props.store.routing.push('/')
      })
  }

  loadBlogPosts() {
    this.contentStore.getBlogPost()
  }

  onEditClick = (e) => {
    const { blog } = this.contentStore
    const postId = e.target.getAttribute('post-id')
    const post = blog.find(item => item._id === postId)

    this.setState({
      postEdit: post,
    })
  }

  onEditFinish = () => {
    this.setState({
      postEdit: null,
    })
  }

  render() {
    const { blog } = this.contentStore
    const { postEdit } = this.state

    return (
      <div className="App">
        <ManageTabs page="blog" />
        <Title content="Blog" />

        {
          !postEdit ? (
            <Container>
            { blog && blog.map(item => (
              <Row className="blog-item" key={item._id}>
                <Col>
                  <img className="img-fluid" src={item.image_ref} />
                </Col>
                <Col>
                  <h2 className="m-0 p-0">{item.title}</h2>
                  <div className="my-3 blog-date">Posted {moment(item.post_date).format('MMMM DD, YYYY')} by {item.author}</div>
                  <p dangerouslySetInnerHTML={{__html: item.body}}></p>
                  <Button
                    post-id={item._id}
                    color="primary"
                    className="edit-blog-post"
                    onClick={this.onEditClick}
                  >
                    Edit
                  </Button>
                </Col>
                <hr/>
              </Row>
            ))}
            </Container>
          ) : (
            <BlogPostEditor post={postEdit} onEditFinish={this.onEditFinish} />
          )
        }
      </div>
    )
  }
}

export default connect("store")(ManageBlog)
