import React, { Component } from 'react'
import {
  Row,
  Col,
  Container,
  Button,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
} from 'reactstrap'
import CustomDatepicker from '../../common/CustomDatepicker'

import { connect } from '../../utils'

class BlogPostEditor extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      post: null,
      file: null,
    }
    
    this.adminStore = this.props.store.admin
    this.contentStore = this.props.store.content
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const prevId = prevState.post && prevState.post._id
    const nextId = nextProps.post && nextProps.post._id

    if(nextId !== prevId){
      return { post: { ...nextProps.post } }
    }
    else return null;
  }

  onInputChange = (e) => {
    const property = e.target.name
    const { post } = this.state
    if (property === 'live') {
      post[property] = e.target.value === 'true'
    } else {
      post[property] = e.target.value
    }
    this.setState({ post })
  }

  onFileChange = (e) => {
    const file = e.target.files[0]
    this.setState({ file })
  }

  onDatePick = (date) => {
    const { post } = this.state
    post.post_date = date
    this.setState({ post })
  }

  onSubmit = (e) => {
    const { onEditFinish } = this.props
    const { post, file } = this.state
    
    let data = new FormData();
    data.append('author', post.author)
    data.append('title', post.title)
    data.append('body', post.body)
    data.append('live', post.live)
    data.append('post_date', post.post_date)
    data.append('image', file)

    this.adminStore.postBlogPost(data)

    onEditFinish && onEditFinish()
    e.preventDefault()
  }
  
  render() {
    const { post } = this.state

    return post ? (
      <section className="page-section pt-1 post-edtior-page temp-class">
        <Container>
          <Row>
            <Col>
            <Form>
              <FormGroup>
                <Label for="postTitle">Post Title</Label>
                <Input value={post.title} type="text" name="title" id="postTitle" onChange={this.onInputChange} />
              </FormGroup>
              <FormGroup>
                <Label for="postAuthor">Post Author</Label>
                <Input value={post.author} type="text" name="author" id="postAuthor" onChange={this.onInputChange} />
              </FormGroup>
              <FormGroup>
                <Label for="postContent">Post Content</Label>
                <Input value={post.body} type="textarea" name="body" id="postContent" onChange={this.onInputChange} />
              </FormGroup>
              <FormGroup>
                <Label for="postImage">Image</Label>
                <Input type="file" name="file" id="postImage" onChange={this.onFileChange} />
                <FormText color="muted">Upload post picture</FormText>
              </FormGroup>
              <Row form>
                <Col>
                <FormGroup>
                  <Label for="postStatus">Post Status</Label>
                  <Input value={post.live} type="select" name="live" id="postStatus" onChange={this.onInputChange} >
                    <option value="true">live</option>
                    <option value="false">draft</option>
                  </Input>
                </FormGroup>
                </Col>
                <Col>
                  <CustomDatepicker date={post.post_date} onDatePick={this.onDatePick} />
                </Col>
              </Row>
              <Button className="my-3" type="button" onClick={this.onSubmit}>Submit</Button>
            </Form>
            </Col>
          </Row>
        </Container>
      </section>
    ) : null
  }
}


export default connect("store")(BlogPostEditor)