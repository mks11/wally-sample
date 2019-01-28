import React, { Component } from 'react';
import {
  Input,
  FormGroup,
  Label,
  Col,
  Button,
} from 'reactstrap';

class ServiceFeedbackModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      feedbackValue: 0,
      feedbackMsg: '',
      feedbackEmail: '',
    }
  }

  componentDidMount() {
    const { user } = this.props.stores
    if (user.feedback) {
      const {
        email,
        value,
      } = user.feedback

      const parsedValue = parseInt(value)
      const feedbackValue = (parsedValue < 4 && parsedValue > -1) ? parsedValue : 1

      this.setState({
        feedbackValue,
        feedbackEmail: email,
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
      feedbackMsg,
    } = this.state

    if (feedbackValue !== null && feedbackEmail) {
      const feedback = {
        feedback: feedbackValue,
        email: feedbackEmail,
        feedback_notes: feedbackMsg,
      }
      
      order.submitServiceFeedback(feedback)
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

    let msgPlaceholder
    switch(feedbackValue) {
      case 0:
        msgPlaceholder = 'Let us know what you are waiting for'
        break;
      case 1:
        msgPlaceholder = 'What would you like to change?'
        break;
      case 2:
        msgPlaceholder = 'Where can we improve?'
        break;
      default:
        break;
    }

    return (
      <div className="login-wrap feedback-modal">
        <h3 className="m-0 mb-2">What do you think?</h3>
        <FormGroup row>
          <Col xs={4}>
            <Button
              className={`${feedbackValue === 2 ? 'active' : ''} feedback-btn`}
              onClick={() => this.handleFeedbackValueChange(2)}
            >
              <img src="images/smile.svg" />
            </Button>
            <div className="feedback-caption">Just haven’t ordered yet, waiting for: …</div>
          </Col>
          <Col xs={4}>
            <Button
              className={`${feedbackValue === 1 ? 'active' : ''} feedback-btn`}
              onClick={() => this.handleFeedbackValueChange(1)}
            >
              <img src="images/meh.svg" />
            </Button>
            <div className="feedback-caption">Want to order, but haven’t because: …</div>
          </Col>
          <Col xs={4}>
            <Button
              className={`${feedbackValue === 0 ? 'active' : ''} feedback-btn`}
              onClick={() => this.handleFeedbackValueChange(0)}
            >
              <img src="images/sad.svg" />
            </Button>
            <div className="feedback-caption">Don’t plan on ordering, here’s why: …</div>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="feedbackMsg" sm={12}>{msgPlaceholder}</Label>
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

export default ServiceFeedbackModal
