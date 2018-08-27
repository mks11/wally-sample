import React, { Component } from 'react'
import BoxOrder from '../common/page/help/BoxOrder';
import Title from '../common/page/Title';
import PropTypes from 'prop-types';
import { connect } from '../utils'

class HelpSingle extends Component {
  state = {
    activeQuestion: null
  }
  constructor(props){
    super(props)

    this.helpStore = this.props.store.help
  }

  componentDidMount(){

    this.userStore.getStatus()
      .then((status) => {
        this.loadData()
      })
  }

  async loadData() {
    await this.helpStore.getQuestions();
  }

  renderTitle(){
    const { title } = this.props.location.state;
    return ( <Title content={title} /> )
  }

  renderBox(){
    const { title, methodName } = this.props.location.state;
    const data   = this.helpStore[methodName]
    return (
      <BoxOrder 
        title={title}
        data={data}
      />
    )
  }

  handleToggleQuestion = (id) => {
    if (id === this.state.activeQuestion) {
      this.setState({activeQuestion: null})
      return
    }
    this.setState({activeQuestion: id})
  }


  render(){
    let qClass = 'list-bordered list-group-item d-flex justify-content-between align-items-center'
    return (
      <div className="app">
        <Title content="Help"/>
         <section className="page-section aw-our--story">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-xs-12">
                  
      <div className="list">
        <div className="list-header">
          <div className="row">
            <div className="col-10">
              <h2>All</h2>
            </div>
            <div className="col-2">
            </div>
          </div>
        </div>
      </div>

                  <ul className="list-group list-group-flush">
                    {this.helpStore.questions.map((item, key) => (
                      <li key={key} className={qClass + (key===this.state.activeQuestion ? ' active' : '')}  onClick={e=>this.handleToggleQuestion(key)}>
                        <div className="row w-100">
                        <div className="col-md-11">
                          <a className="list-link"><h4> {item.question_text} </h4></a>
                        </div>
                        <span className="badge badge-pill col-md-1">
                          <i className="fa fa-chevron-right fa-2x"></i>
                        </span>
                        <div className="answer ml-3">
                          {item.answer_text}
                        </div>
                      </div>
                      </li>
                    ))}

                  </ul>
                </div>
              </div>
          </div>
        </section>
      </div>
    );
  }
}

HelpSingle.propTypes =  {
  title: PropTypes.string
}

export default connect("store")(HelpSingle)
