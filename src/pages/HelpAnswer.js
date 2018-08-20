import  React, { Component } from 'react'
import { connect } from '../utils'

import Title from '../common/page/Title'
import Axios from 'axios'

import { API_HELP_GET_QUESTION_SINGLE } from '../config'

class HelpAnswer extends Component {
  state = {
    question: {}
  }

  constructor(props, context){
    super(props, context)
    this.helpStore = this.props.store.help
  }

  async fetchData(id){
    const resp = await Axios(`${API_HELP_GET_QUESTION_SINGLE}/${id}`)
    await this.setState({
      question: resp.data
    })
  }

  async componentWillMount(){
    // await this.helpStore.getQuestion(1);
    await this.fetchData(1);
    // console.log(this.helpStore.question.text)
  }

  renderTitle(){
    // const { title } = this.props.location.state;
    return ( <Title content="Help" /> )
  }

  render(){
    return (
      <div className="app">
        { this.renderTitle() }
        <section className="page-section aw-our--story">
            <div className="container">
              <div className="row">
                <div className="col-md-12 col-xs-12">
                  
                  <h2>{this.state.question.text}</h2>
                  <p>{this.state.question.answer}</p>
                  
                </div>
              </div>
          </div>
        </section>
      </div>
    )
  }
}

export default connect("store")(HelpAnswer)
