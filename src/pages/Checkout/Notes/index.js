import React, { Component } from 'react'
import { Input } from 'reactstrap'

class Notes extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notes: props.default || '',
      fixed: !!props.default || false,
    }
  }

  componentDidMount() {
    const { onSubmit } = this.props
    const { notes } = this.state
    this.props.default && onSubmit && onSubmit(notes)
  }

  handleAction = () => {
    const { onSubmit } = this.props
    const { notes, fixed } = this.state
    
    if (!fixed && notes.length) {
      onSubmit && onSubmit(notes)
    }

    notes.length && this.setState({ fixed: !fixed })
  }

  handleDeliveryNoteChange = e => {
    this.setState({ notes: e.target.value })
  }

  render() {
    const { title, placeholder } = this.props
    const { fixed, notes } = this.state

    return (
      <div className="delivery-notes">
        <h3 className="mb-3">{title}</h3>
        <div className="card-body">
          {
            fixed
              ? <p>{notes}</p>
              : <Input
                  className="mb-3 aw-input--control aw-input--left aw-input--bordered"
                  placeholder={placeholder}
                  type="textarea"
                  value={notes}
                  onChange={this.handleDeliveryNoteChange}
                />
          }
          <button
            className={`btn btn-main ${notes.length ? 'active' : ''}`}
            onClick={this.handleAction}
          >
            { fixed ? 'CHANGE' : 'SUBMIT' }
          </button>
        </div>
      </div>
    )
  }  
}

export default Notes