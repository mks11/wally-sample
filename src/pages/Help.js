import React, { Fragment, Component } from 'react';
import Title from '../common/page/Title'
import Box from '../common/page/help/Box'
import BoxOrder from '../common/page/help/BoxOrder'
import SearchForm from '../common/page/help/SearchForm'
import { connect } from '../utils'
import { Link } from 'react-router-dom'

class Help extends Component {
  state = {
    activeQuestion: null,
    terms: '',
    searchResults: [],
    onSearch: false
  }

  constructor(props, context){
    super(props, context)
    this.helpStore = this.props.store.help
  }

  async componentDidMount(){
    await this.helpStore.getQuestions();
    await this.helpStore.getHelpTopics();
    await this.helpStore.getContact();
  }

  handleToggleQuestion = (id) => {
    if (id === this.state.activeQuestion) {
      this.setState({activeQuestion: null})
      return
    }
    this.setState({activeQuestion: id})
  }

  handleSearch = (e) => {
    console.log(this.state.terms)
    this.helpStore.search(this.state.terms).then((data) => {
      this.setState({onSearch: true, searchResults: data})
    })
    e.preventDefault()
  }

  handleSearchEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch(e)
    }
  }


  render() {
    let qClass = 'list-bordered list-group-item d-flex justify-content-between align-items-center'
    return (
      <div className="App">
        <Title content="Help" />

        <section className="page-section aw-our--story">

          <div className="container">
            <form className="search-form" onSubmit={this.handleSearch}>
              <i className="fa fa-search"></i>
              <input type="text"  placeholder="Search anything..." value={this.state.terms} onChange={e=>this.setState({terms: e.target.value})}
                onKeyDown={this.handleSearchEnter}
              />
            </form>
          </div>

          <div className="help-content">
            <div className="container">

                { this.state.onSearch  ?
              <div className="row">
                    <div className="col-md-12 col-xs-12 help-box">
                      <div className="list-header">
                        <div className="row">
                          <div className="col-10">
                            <h2>Search results</h2>
                          </div>
                        </div>
                      </div>
                      <ul className="list-group list-group-flush">
                        {this.state.searchResults.map((item, key) => (
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
                    : 
                    <Fragment>
                      <div className="row">
                      <div className="col-md-6 col-xs-12 help-box">
                        <Box />
                      </div>

                      <div className="col-md-6 col-xs-12 help-box">
                        <div className="list-header">
                          <div className="row">
                            <div className="col-10">
                              <h2>Top Questions</h2>
                            </div>
                            <div className="col-2"><a className="view-all" href="help/all">View All</a></div>
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
                    <br />
                    <br />
                    <div className="row">
                      <div className="col-md-6 col-xs-12 help-box">

                        <div className="list-header">
                          <div className="row">
                            <div className="col-10">
                              <h2>Top Questions</h2>
                            </div>
                            <div className="col-2"><a className="view-all" href="help/all">View All</a></div>
                          </div>
                        </div>
                        <ul className="list-group list-group-flush">
                          {this.helpStore.topics.map((item, key) => (
                            <li key={key} className="list-bordered list-group-item d-flex justify-content-between align-items-center">
                              <div className="row">
                                <Link className="list-link" to={""}><h4> {item.name} </h4></Link>
                              </div>
                              <span className="badge badge-pill">
                                <i className="fa fa-chevron-right fa-2x"></i>
                              </span>
                            </li>
                          ))}

                        </ul>
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

                  </Fragment>
                }
              </div>
            </div>
          </section>
        </div>
        );
        }
        }

        export default connect("store")(Help);
