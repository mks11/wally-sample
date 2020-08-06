import React, { Component } from "react";
import ReactGA from "react-ga";
import { Link } from "react-router-dom";
import moment from "moment";
import { PuffLoader } from "react-spinners";
import { connect } from "../utils";

import Head from "../common/Head";
import Title from "../common/page/Title";

class Blog extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoading: false,
      posts: [],
    };

    this.userStore = this.props.store.user;
    this.contentStore = this.props.store.content;
    this.routing = this.props.store.routing;
  }
  componentDidMount() {
    ReactGA.pageview("/blog");
    this.userStore.getStatus().then((status) => {
      this.loadData();
    });
  }

  loadData() {
    this.setState({ isLoading: true });
    this.contentStore.getBlogPosts().then((posts) => {
      console.log(posts);
      for (let post of posts) {
        console.log(post);
        post.need_readmore = post.body.length >= 150;
        post.readmore = false;

        // TODO Set with css text elipsis, not JS
        post.body_stripped = post.body.substring(0, 150);
        post.body_displayed = post.body_stripped + "...";
      }

      this.setState({ isLoading: false, posts });
    });
  }

  // TODO KILL BOOTSTRAP
  render() {
    const { isLoading, posts } = this.state;
    return (
      <div className="App">
        <Head title="Blog" description="The Wally Shop blog." />
        <Title content="Blog" />
        <section>
          <div className="container mt-5">
            {isLoading ? (
              <PuffLoader />
            ) : (
              posts.map((post, key) => (
                <div className="row blog-item" key={key}>
                  <div className="col">
                    <img className="img-fluid" src={post.image_ref} alt="" />
                  </div>
                  <div className="col">
                    <h2 className="m-0 p-0">
                      <Link to={`/blog/${post._id}`}>{post.title}</Link>
                    </h2>
                    <div className="my-3 blog-date">
                      Posted{" "}
                      {moment.utc(post.post_date).format("MMMM DD, YYYY")} by{" "}
                      {post.author}
                    </div>
                    <p
                      dangerouslySetInnerHTML={{ __html: post.body_displayed }}
                    ></p>
                    <Link to={`/blog/${post._id}`} className="readmore">
                      Read more &nbsp;<i className="fa fa-chevron-right"></i>
                    </Link>
                  </div>
                  <hr />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(Blog);
