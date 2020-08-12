import React, { Component } from "react";
import Title from "../common/page/Title";
import PropTypes from "prop-types";

import { logPageView } from "services/google-analytics";
import { connect } from "../utils";

class HelpSingle extends Component {
  state = {
    question: null,
    answer: null,
  };
  constructor(props) {
    super(props);

    this.helpStore = this.props.store.help;
    this.userStore = this.props.store.user;
    this.routing = this.props.store.routing;
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
    const id = this.props.match.params.id;
    // if (this.helpStore.questions.length === 0) {
    //   this.routing.push('/help')
    //   return
    // }
    this.helpStore.getQuestions("all").then((data) => {
      const detail = this.helpStore.getDetail(id);
      this.setState({
        question: detail.question_text,
        answer: detail.answer_text,
      });
    });
  }

  render() {
    // let qClass = 'list-bordered list-group-item d-flex justify-content-between align-items-center'
    return (
      <div className="app">
        <Title content="Help" />
        <section className="page-section aw-our--story">
          <div className="container">
            <div className="row">
              <div className="col-md-12 col-xs-12">
                <div className="list">
                  <div className="list-header">
                    <div className="row">
                      <div className="col-10">
                        <h2>{this.state.question}</h2>
                      </div>
                      <div className="col-2"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-2">{this.state.answer}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

HelpSingle.propTypes = {
  title: PropTypes.string,
};

export default connect("store")(HelpSingle);
