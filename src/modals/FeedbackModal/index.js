import React, { Component } from 'react';
import {
  Input,
  FormGroup,
  Label,
  Col,
  Button,
} from 'reactstrap';

class FeedbackModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      feedbackValue: 0,
      feedbackMsg: '',
      feedbackEmail: '',
      feedbackOrder: null,
    }
  }

  componentDidMount() {
    const { user } = this.props.stores
    if (user.feedback) {
      const {
        email,
        value,
        order,
      } = user.feedback

      this.setState({
        feedbackValue: parseInt(value),
        feedbackEmail: email,
        feedbackOrder: order,
      })
    }
  }

  handleFeedbackValueChange = value => {
    this.setState({ feedbackValue: value })
  }

  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value.toString(),
    })
  }

  handleSubmit = e => {
    const {
      order,
    } = this.props.stores
    const {
      feedbackValue,
      feedbackEmail,
      feedbackOrder,
      feedbackMsg,
    } = this.state

    if (feedbackValue && feedbackEmail && feedbackOrder) {
      const feedback = {
        feedback: feedbackValue,
        email: feedbackEmail,
        order_id: feedbackOrder,
        feedback_notes: feedbackMsg,
      }
      
      order.submitFeedback(feedback)
        .then(res => {
          this.props.toggle()
        })
        .catch(e => {
          console.log(e)
          this.props.toggle()
        })
    }
    e.preventDefault()
  }

  render() {
    const {
      feedbackValue
    } = this.state

    return (
      <div className="login-wrap feedback-modal">
        <h3 className="m-0 mb-2">How did we do?</h3>
        <FormGroup row>
          <Col sm={4}>
            <Button
              className={`${feedbackValue === 0 ? 'active' : ''}`}
              onClick={() => this.handleFeedbackValueChange(0)}
            >0</Button>
          </Col>
          <Col sm={4}>
            <Button
              className={`${feedbackValue === 1 ? 'active' : ''}`}
              onClick={() => this.handleFeedbackValueChange(1)}
            >1</Button>
          </Col>
          <Col sm={4}>
            <Button
              className={`${feedbackValue === 2 ? 'active' : ''}`}
              onClick={() => this.handleFeedbackValueChange(2)}
            >2</Button>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="feedbackMsg" sm={12}>Please leave your feedback below</Label>
          <Col sm={12}>
            <Input
              type="textarea"
              name="feedbackMsg"
              id="feedbackMsg"
              onChange={this.handleInputChange}
            />
          </Col>
        </FormGroup>
        <button className="btn btn-main active" onClick={this.handleSubmit}>Submit Feedback</button>
      </div>
    )
  }
}

export default FeedbackModal
