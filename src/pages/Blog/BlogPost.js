import React, { Component } from "react";
import ReactGA from "react-ga";
import { Redirect } from "react-router-dom";
import { Container, Grid } from "@material-ui/core";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import styled from "styled-components";

import { connect, logEvent } from "utils";
import Head from "common/Head";
import { ResponsiveText } from "common/ResponsiveText";
import { BlogPostSubtitle } from "./Blog";

const PostContainer = styled(Grid)`
  @media only screen and (max-width: 767px) {
    justify-content: center;
    align-items: flex-start;
  }
  @media only screen and (min-width: 768px) {
    justify-content: flex-start;
    align-items: flex-start;
  }
`;

class BlogPost extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      post: props.location.state,
    };

    this.userStore = this.props.store.user;
    this.contentStore = this.props.store.content;
    this.routing = this.props.store.routing;
    this.handleGetStarted = this.handleGetStarted.bind(this);
  }
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
  }

  handleGetStarted(e) {
    logEvent({ category: "BlogPost", action: "GetStarted" });
    this.routing.push("/");
    e.preventDefault();
  }

  render() {
    const { slug } = this.props.match.params;
    const { post } = this.state;
    if (!slug || !post) {
      return <Redirect to="/blog"></Redirect>;
    }

    const { author, posted_date, metadescription } = post;

    return (
      <Container maxWidth="lg" component={"section"}>
        <Head title={post.title} description={metadescription} />
        <PostContainer
          container
          justify="center"
          alignItems="center"
          component="article"
        >
          <ResponsiveText variant="h1" align="center" gutterBottom>
            {post.title}
          </ResponsiveText>
          <BlogPostSubtitle author={author} postDate={posted_date} />
          {post.body.length
            ? post.body.map((section) => {
                const { title, image, body } = section;
                return <PostSection title={title} image={image} body={body} />;
              })
            : null}
          <button
            onClick={this.handleGetStarted}
            className="btn btn-main active blog-get-started"
            data-submit="Submit"
          >
            Start shopping
          </button>
        </PostContainer>
      </Container>
    );
  }
}

const SectionContainer = styled(Grid)`
  @media only screen and (max-width: 767px) {
    justify-content: center;
    align-items: flex-start;
  }
  @media only screen and (min-width: 768px) {
    justify-content: flex-start;
    align-items: flex-start;
  }
  margin-bottom: 1rem;
`;

const SectionImage = styled.img`
  width: 100%;
`;

const SectionImageMobileWrapper = styled(Grid)`
  @media only screen and (min-width: 576px) {
    display: none;
  }
`;

function SectionImageMobile({ image }) {
  return (
    <SectionImageMobileWrapper item xs={12} sm={12} md={12} lg={12} xl={12}>
      <LazyLoadComponent>
        <SectionImage src={image.src} alt={image.alt} />
      </LazyLoadComponent>
    </SectionImageMobileWrapper>
  );
}

const SectionImageFloated = styled.img`
  @media only screen and (max-width: 575px) {
    display: none;
  }
  @media only screen and (min-width: 576px) {
    max-width: 400px;
    float: right;
    margin: 1rem;
    &::after {
      content: "";
      display: block;
      clear: both;
    }
  }

  width: 100%;
  &::after {
    content: "";
    display: block;
    clear: both;
  }
`;

function PostSection({ title, image, body }) {
  return (
    <SectionContainer
      container
      justify="center"
      alignItems="center"
      spacing={4}
      component="section"
    >
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <ResponsiveText variant="h2">{title}</ResponsiveText>
      </Grid>
      <SectionImageMobile image={image} />
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <LazyLoadComponent>
          <SectionImageFloated src={image.src} alt={image.alt} />
        </LazyLoadComponent>
        <ResponsiveText
          variant="body1"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </Grid>
    </SectionContainer>
  );
}

export default connect("store")(BlogPost);
