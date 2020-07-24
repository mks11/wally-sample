import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom'
import ReactGA from 'react-ga';
import moment from 'moment'

import { connect, formatMoney } from '../utils'

import BoxOrder from '../common/page/help/BoxOrder'
import Head from '../common/Head'
import Title from '../common/page/Title'
import  ReportModal from './orders/ReportModal'
import  ReportSuccessModal from './orders/ReportSuccessModal'


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
    this.userStore = this.props.store.user
    this.routing = this.props.store.routing
    this.orderStore = this.props.store.order
    this.modalStore = this.props.store.modal
  }

  componentDidMount(){
    ReactGA.pageview(window.location.pathname);
    this.userStore.getStatus()
      .then((status) => {
        this.loadData()
      })
  }

  loadData() {
    this.helpStore.getQuestions('top');
    this.helpStore.getHelpTopics();
    // await this.helpStore.getContact();

    if (this.userStore.status) {
      this.orderStore.getOrders(this.userStore.getHeaderAuth())
    }


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
  handleViewAllQuestions = (e) => {
    this.helpStore.activeTopics = 'All'
    this.routing.push('/help/topics')
    e.preventDefault()
  }

  handleViewAllOrders = (e) => {
    this.routing.push('/orders')
    e.preventDefault()
  }
  countItems(data) {
    let total = 0 
    if (!data) return formatMoney(total)

    for (const d of data) {
      total += parseFloat(d.customer_quantity)
    }
    return formatMoney(total)
  }

  printItems(data) {
    let items = []
    if (!data) return items

    for (const d of data) {
      items.push(d.product_name)
    }
    return items.join(', ')
  }

  printPackaging(data) {
    let items = []
    if (!data) return items

    for (const d of data) {
      items.push(d.type)
    }
    return items.join(', ')
  }

  goToTopics(id, name) {
    this.helpStore.activeTopics = name
    this.routing.push('/help/topics/'+id)
  }

  handleReportOrder = (item) => {
    this.orderStore.toggleReport(item)
  }

  render() {
    let qClass = 'list-bordered list-group-item '
    return (
      <div className="App">
        <Head
          title="Help"
          description="Get help with The Wally Shop's service."
        />
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

          <div className="help-content mt-5">
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
                            <div className="d-flex justify-content-between">
                              <div className="">
                                <a className="list-link"><h4> {item.question_text} </h4></a>
                              </div>
                              <span className="badge badge-pill">
                                <i className="fa fa-chevron-right fa-2x"></i>
                              </span>
                            </div>
                              <div className="answer">
                                {item.answer_text}
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
                        <div className="list">
                          <div className="list-header">
                            <div className="row">
                              <div className="col-10">
                                <h2>Recent Orders</h2>
                              </div>
                              <div className="col-2">
                                <a className="view-all" href="#"  onClick={this.handleViewAllOrders}>View All</a>
                              </div>
                            </div>
                          </div>

                          <ul className="list-group list-group-flush">

                            <table className="table table-sm borderless" > 
                              {this.orderStore.orders.map((item, key) => (
                                <React.Fragment key={key}>
                                  <thead>
                                    <tr>
                                      <th scope="col" style={{width: '110px'}}>{item.cart_items ? "Order Placed" : "Packaging Returned"}</th>
                                      <th scope="col">Items</th>
                                      <th scope="col" style={{width: '80px'}}>Total</th>
                                      <th />
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>{item.createdAt ? moment(item.createdAt.substring(0,10)).format('MMM DD, YYYY') : ''}</td>
                                      <td>{item.cart_items ? this.printItems(item.cart_items) : this.printPackaging(item.returns)}</td>
                                      <td>{item.total ? ( item.total ? formatMoney(item.total/100) : "$0.00") : (item.total_credit ? formatMoney(item.total_credit/100) : "$0.00")}</td>
                                      <td>
                                        <button onClick={this.handleReportOrder.bind(this, item)} className="help-btn">
                                          Help
                                        </button>
                                      </td>
                                    </tr>
                                  </tbody>
                                </React.Fragment>
                              ))}
                            </table>
                          </ul>
                        </div>
                      </div>

                      <div className="col-md-6 col-xs-12 help-box">
                        <div className="list-header">
                          <div className="row">
                            <div className="col-10">
                              <h2>Top Questions</h2>
                            </div>
                            <div className="col-2"><a className="view-all" href="#"  onClick={this.handleViewAllQuestions}>View All</a></div>
                          </div>
                        </div>
                        <ul className="list-group list-group-flush">
                          {this.helpStore.questions.map((item, key) => (
                            <li key={key} className={qClass + (key===this.state.activeQuestion ? ' active' : '')}  onClick={e=>this.handleToggleQuestion(key)}>
                              <div className="d-flex justify-content-between">
                                <div className="">
                                  <a className="list-link"><h4> {item.question_text} </h4></a>
                                </div>
                                <span className="badge badge-pill">
                                  <i className="fa fa-chevron-right fa-2x"></i>
                                </span>
                              </div>
                                <div className="answer">
                                  {item.read_more ?
                                      <React.Fragment>
                                        {item.answer_text.substring(0, 50)}...<Link className="text-violet text-bold" to={"/help/detail/" + item._id}>Read more</Link>
                                      </React.Fragment>
                                      :
                                      <React.Fragment>
                                      {item.answer_text}
                                      </React.Fragment>
                                  }
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
                              <h2>Topics</h2>
                            </div>
                            <div className="col-2"><a className="view-all" href="#"  onClick={this.handleViewAllQuestions}>View All</a></div>
                          </div>
                        </div>
                        <ul className="list-group list-group-flush">
                          {this.helpStore.topics.map((item, key) => (
                            <li key={key} className="list-bordered list-group-item d-flex justify-content-between align-items-center cursor-pointer" onClick={e=>this.goToTopics(item._id, item.name)} >
                              <div className="row">
                                <a className="list-link" ><h4> {item.name} </h4></a>
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
                          title="Contact Us"
                          data={this.helpStore.contact}
                          methodName="contact"
                        />


                      <li className="list-bordered list-group-item d-flex justify-content-between align-items-center cursor-pointer">
                        <div className="row">
                          <i className="fa fa-envelope ml-2"></i>

                          <a href="mailto:info@thewallyshop.co" className="list-link ml-3">
                            <h4> 
                             info@thewallyshop.co
                            </h4>
                          </a>
                        </div>
                      </li>
                    </div>
                  </div>

                </Fragment>
              }
            </div>
          </div>
        </section>
      <ReportModal/>
      <ReportSuccessModal/>
      </div>
    );
  }
}

export default connect("store")(Help);
