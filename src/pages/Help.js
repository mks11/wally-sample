import React, { Component } from 'react';
import Title from '../common/page/Title'
import Box from '../common/page/help/Box'
import BoxOrder from '../common/page/help/BoxOrder'
import SearchForm from '../common/page/help/SearchForm'
import { connect } from '../utils'

class Help extends Component {

  constructor(props, context){
    super(props, context)
    this.helpStore = this.props.store.help
  }

  async componentDidMount(){
    await this.helpStore.getQuestions();
    await this.helpStore.getHelpTopics();
    await this.helpStore.getContact();
  }

  render() {
    return (
      <div className="App">
        <Title content="Help" />

        <section className="page-section aw-our--story">
          
          <div className="container">
            <SearchForm />
          </div>

          <div className="help-content">
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-xs-12 help-box">
                  <Box />
                </div>

                <div className="col-md-6 col-xs-12 help-box">
                  <BoxOrder 
                    title="Top questions"
                    viewAll="help/top-question"
                    data={this.helpStore.questions}
                    methodName="questions"
                  />
                </div>
              </div>
              <br />
              <br />
              <div className="row">
                <div className="col-md-6 col-xs-12 help-box">
                  <BoxOrder 
                    title="Browse help topics"
                    data={this.helpStore.topics}
                    viewAll="help/help-topics"
                    methodName="topics"
                  />
                </div>
                
                <div className="col-md-6 col-xs-12 help-box">
                  <BoxOrder
                    title="Contact us"
                    data={this.helpStore.contact}
                    viewAll="help/contact-us"
                    methodName="contact"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(Help);
