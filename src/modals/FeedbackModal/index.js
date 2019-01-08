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

      const parsedValue = parseInt(value)
      const feedbackValue = (parsedValue < 4 && parsedValue > -1) ? parsedValue : 1

      this.setState({
        feedbackValue,
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
          <Col xs={4}>
            <Button
              className={`${feedbackValue === 0 ? 'active' : ''} feedback-btn`}
              onClick={() => this.handleFeedbackValueChange(0)}
            >
              <img src="images/smile.svg" />
            </Button>
          </Col>
          <Col xs={4}>
            <Button
              className={`${feedbackValue === 1 ? 'active' : ''} feedback-btn`}
              onClick={() => this.handleFeedbackValueChange(1)}
            >
              <img src="images/meh.svg" />
            </Button>
          </Col>
          <Col xs={4}>
            <Button
              className={`${feedbackValue === 2 ? 'active' : ''} feedback-btn`}
              onClick={() => this.handleFeedbackValueChange(2)}
            >
              <img src="images/sad.svg" />
            </Button>
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
