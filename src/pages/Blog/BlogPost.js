import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import styled from "styled-components";
import "./BlogPost.module.css";
import { logPageView, logEvent } from "services/google-analytics";
import { connect } from "utils";

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

const StartShopping = styled(Button)`
  width: 250px;
  text-align: center;
  background-color: #97adff;
  border-radius: 500px;
  padding: 1rem;
  color: #fff;
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
    // Store page view in google analytics
    const { location } = this.routing;
    logPageView(location.pathname);
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
          <Grid item xs={12}>
            <ResponsiveText variant="h1" align="center" gutterBottom>
              {post.title}
            </ResponsiveText>
          </Grid>
          <Grid item xs={12}>
            <BlogPostSubtitle author={author} postDate={posted_date} />
          </Grid>
          <br />
          {post.body.length
            ? post.body.map((section) => {
                const { title, image, body } = section;
                return <PostSection title={title} image={image} body={body} />;
              })
            : null}
        </PostContainer>
        <Grid container justify="center">
          <Grid item>
            <StartShopping onClick={this.handleGetStarted}>
              <Typography variant="h3" component="span">
                Start Shopping
              </Typography>
            </StartShopping>
          </Grid>
        </Grid>
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
      {image && <SectionImageMobile image={image} />}
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        {image && (
          <LazyLoadComponent>
            <SectionImageFloated src={image.src} alt={image.alt} />
          </LazyLoadComponent>
        )}
        <ResponsiveText
          variant="body1"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </Grid>
    </SectionContainer>
  );
}

export default connect("store")(BlogPost);
