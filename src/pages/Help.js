import React, { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { logPageView } from 'services/google-analytics';
import { connect, formatMoney } from '../utils';
import styled from 'styled-components';

// Components
import Head from 'common/Head';
import { PageTitle } from 'common/page/Title';
import { Container, Grid, Paper, Typography } from '@material-ui/core';

const OrderHelpCTA = styled(Paper)`
  padding: 2rem;
  margin-bottom: 2rem;
`;

class Help extends Component {
  state = {
    activeQuestion: null,
    terms: '',
    searchResults: [],
    onSearch: false,
  };

  constructor(props, context) {
    super(props, context);
    this.helpStore = this.props.store.help;
    this.userStore = this.props.store.user;
    this.routing = this.props.store.routing;
    this.orderStore = this.props.store.order;
    this.modalStore = this.props.store.modal;
  }

  componentDidMount() {
    // Store page view in google analytics
    const { location } = this.routing;
    logPageView(location.pathname);
    this.userStore.getStatus().then((status) => {
      this.loadData();
    });
  }

  loadData() {
    this.helpStore.getQuestions('top');
    this.helpStore.getHelpTopics();
  }

  handleToggleQuestion = (id) => {
    if (id === this.state.activeQuestion) {
      this.setState({ activeQuestion: null });
      return;
    }
    this.setState({ activeQuestion: id });
  };

  handleSearch = (e) => {
    this.helpStore.search(this.state.terms).then((data) => {
      this.setState({ onSearch: true, searchResults: data });
    });
    e.preventDefault();
  };

  handleSearchEnter = (e) => {
    if (e.keyCode === 13) {
      this.handleSearch(e);
    }
  };

  handleViewAllQuestions = (e) => {
    this.helpStore.activeTopics = 'All';
    this.routing.push('/help/topics');
    e.preventDefault();
  };

  goToTopics(id, name) {
    this.helpStore.activeTopics = name;
    this.routing.push('/help/topics/' + id);
  }

  render() {
    let qClass = 'list-bordered list-group-item ';
    return (
      <Container maxWidth={'lg'}>
        <Head
          title="Help"
          description="Get help with The Wally Shop's service."
        />
        <PageTitle variant="h1" gutterBottom>
          Help
        </PageTitle>

        <section className="page-section aw-our--story">
          <Grid container>
            <Grid item xs={12}>
              <OrderHelpCTA elevation={3}>
                <Typography variant="h2" gutterBottom>
                  Having a problem?
                </Typography>
                <Typography variant="body1" gutterBottom>
                  You can report a problem with your order or packaging return
                  on{' '}
                  <Link to="/orders" style={{ color: '#6060a8' }}>
                    the order history page
                  </Link>
                  .
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Locate the order or packaging return you're having trouble
                  with, then click the{' '}
                  <span>
                    <strong>'Report A Problem'</strong>
                  </span>{' '}
                  button to file your request for support.
                </Typography>
                <Typography variant="body1" gutterBottom>
                  For all other support related matters, contact us at{' '}
                  <a
                    href="mailto:info@thewallyshop.co"
                    target="_blank"
                    rel="noopenner noreferrer"
                    style={{ color: '#6060a8' }}
                  >
                    info@thewallyshop.co
                  </a>
                  .
                </Typography>
              </OrderHelpCTA>
            </Grid>
          </Grid>
          <div className="help-content mt-5">
            {this.state.onSearch ? (
              <div className="row">
                <div className="col-md-12 col-xs-12 help-box">
                  <div className="list-header">
                    <div className="row">
                      <div className="col-10">
                        <Typography variant="h2" gutterBottom>
                          Search results
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <ul className="list-group list-group-flush">
                    {this.state.searchResults.map((item, key) => (
                      <li
                        key={key}
                        className={
                          qClass +
                          (key === this.state.activeQuestion ? ' active' : '')
                        }
                        onClick={(e) => this.handleToggleQuestion(key)}
                      >
                        <a className="list-link">
                          <Typography variant="body1">
                            {item.question_text}
                          </Typography>
                        </a>
                        <div className="answer">{item.answer_text}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Fragment>
                <Grid item xs={12}>
                  <Typography variant="h2" gutterBottom>
                    Frequently Asked Questions
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <ul className="list-group list-group-flush">
                    {this.helpStore.questions.map((item, key) => (
                      <li
                        key={key}
                        className={
                          qClass +
                          (key === this.state.activeQuestion ? ' active' : '')
                        }
                        onClick={(e) => this.handleToggleQuestion(key)}
                      >
                        <a className="list-link">
                          <Typography variant="body1">
                            {item.question_text}
                          </Typography>
                        </a>
                        <div className="answer">
                          {item.read_more ? (
                            <React.Fragment>
                              {item.answer_text.substring(0, 50)}...
                              <Link
                                className="text-violet text-bold"
                                to={'/help/detail/' + item._id}
                              >
                                Read more
                              </Link>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>{item.answer_text}</React.Fragment>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </Grid>
                <br />
                <br />
                <br />
                <br />
                <br />
                <div className="row">
                  <div className="col-md-12 col-xs-12 help-box">
                    <Typography variant="h2" gutterBottom>
                      Topics
                    </Typography>
                    <form className="search-form" onSubmit={this.handleSearch}>
                      <i className="fa fa-search"></i>
                      <input
                        type="text"
                        placeholder="Search"
                        value={this.state.terms}
                        onChange={(e) =>
                          this.setState({ terms: e.target.value })
                        }
                        onKeyDown={this.handleSearchEnter}
                      />
                    </form>
                    <ul className="list-group list-group-flush">
                      {this.helpStore.topics.map((item, key) => (
                        <li
                          key={key}
                          className="list-bordered list-group-item d-flex justify-content-between align-items-center cursor-pointer"
                          onClick={(e) => this.goToTopics(item._id, item.name)}
                        >
                          <a className="list-link">
                            <Typography variant="body1">{item.name}</Typography>
                          </a>
                        </li>
                      ))}
                      <li className="list-bordered list-group-item d-flex justify-content-between align-items-center cursor-pointer">
                        <a
                          href="#"
                          onClick={this.handleViewAllQuestions}
                          style={{ color: '#6060a8' }}
                        >
                          <Typography variant="body1">View All</Typography>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        </section>
      </Container>
    );
  }
}

export default connect('store')(Help);
