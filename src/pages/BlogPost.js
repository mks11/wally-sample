import React, { Component } from "react";
import ReactGA from "react-ga";
import Title from "../common/page/Title";
import { Row, Col } from "reactstrap";
import { connect, logEvent } from "../utils";
import moment from "moment";

class BlogPost extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      item: null,
    };

    this.userStore = this.props.store.user;
    this.contentStore = this.props.store.content;
    this.routing = this.props.store.routing;
    this.handleGetStarted = this.handleGetStarted.bind(this);
  }
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    this.userStore.getStatus().then(() => {
      // this.loadData();
    });
  }

  handleGetStarted(e) {
    logEvent({ category: "BlogPost", action: "GetStarted" });
    this.routing.push("/");
    e.preventDefault();
  }

  render() {
    const id = this.props.match.params.id;
    const { item } = this.state;

    if (!id || !item) {
      return null;
    }

    return (
      <div className="App">
        <Title content="Blog" />
        <section>
          <div className="container mt-5">
            <Row className="blog-item blog-post">
              <Col>
                <img className="img-fluid" src={item.image_ref} alt="" />
                <h2 className="m-0 p-0">{item.title}</h2>
                <div className="my-3 blog-date">
                  Posted {moment.utc(item.post_date).format("MMMM DD, YYYY")} by{" "}
                  {item.author}
                </div>
                <p dangerouslySetInnerHTML={{ __html: item.body }}></p>
              </Col>
              <hr />
            </Row>
            <Row>
              <Col>
                <button
                  onClick={this.handleGetStarted}
                  className="btn btn-main active blog-get-started"
                  data-submit="Submit"
                >
                  Start shopping
                </button>
              </Col>
            </Row>
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(BlogPost);
