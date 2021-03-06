import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Container, Grid, Typography } from '@material-ui/core';
import { FaChevronRight } from 'react-icons/fa';
import styled from 'styled-components';

import { logPageView } from 'services/google-analytics';
import { connect } from '../../utils';

import Head from 'common/Head';
import { PageTitle } from 'common/page/Title';
import { ResponsiveText } from 'common/ResponsiveText';

class Blog extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      posts: [],
    };

    this.userStore = this.props.store.user;
    this.contentStore = this.props.store.content;
    this.routing = this.props.store.routing;
    this.loading = this.props.store.loading;
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
    this.loading.show();
    this.contentStore
      .getBlogPosts()
      .then((posts) => {
        this.setState({ posts });
      })
      .finally(() => setTimeout(() => this.loading.hide(), 400));
  }

  render() {
    const { posts } = this.state;
    return (
      <Container maxWidth="lg" component={'section'}>
        <Head title="Blog" description="The Wally Shop blog." />
        <PageTitle variant="h1" align="center" gutterBottom>
          Blog
        </PageTitle>
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </Container>
    );
  }
}

const BlogPostCardContainer = styled(Grid)`
  @media only screen and (max-width: 767px) {
    justify-content: center;
    align-items: flex-start;
  }
  @media only screen and (min-width: 768px) {
    justify-content: flex-start;
    align-items: flex-start;
  }

  margin-bottom: 1rem;
  border-bottom: 2px solid #ebebeb;
`;

export const BlogPostTitle = ({ children }) => {
  return <ResponsiveText variant="h2">{children}</ResponsiveText>;
};

export const BlogPostSubtitle = ({ postDate, author }) => {
  const postedBy = `Posted ${moment
    .utc(postDate)
    .format('MMMM DD, YYYY')} by ${author}`;
  return (
    <ResponsiveText variant="subtitle1" gutterBottom>
      {postedBy}
    </ResponsiveText>
  );
};

export const BlogPostImage = styled.img`
  width: 100%;
`;

const ReadMore = styled(Link)`
  display: flex;
  align-items: center;
  color: #97adff;
  &:visited {
    color: #6060a8;
  }
`;

function BlogPostCard({ post }) {
  const intro = post.body[0];

  const postPath = {
    pathname: `/blog/${post.slug}`,
    state: post,
  };

  return (
    <BlogPostCardContainer
      container
      justify="center"
      alignItems="center"
      spacing={4}
      component="article"
    >
      <Grid item xs={10} sm={10} md={12} lg={12} xl={12}>
        <BlogPostTitle>
          <ReadMore to={postPath}>{post.title}</ReadMore>
        </BlogPostTitle>
        <BlogPostSubtitle author={post.author} postDate={post.post_date} />
      </Grid>
      {intro.image && (
        <>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <BlogPostImage src={intro.image.src} alt={intro.image.alt} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: `${intro.body.substring(0, 300)}...`,
              }}
            />
            <Typography variant="h5" component="div">
              <ReadMore to={postPath}>
                Read more
                <FaChevronRight />
              </ReadMore>
            </Typography>
          </Grid>
        </>
      )}
      {!intro.image && (
        <Grid item xs={12}>
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: `${intro.body.substring(0, 300)}...`,
            }}
          />
          <Typography variant="h5" component="div">
            <ReadMore to={postPath}>
              Read more
              <FaChevronRight />
            </ReadMore>
          </Typography>
        </Grid>
      )}
    </BlogPostCardContainer>
  );
}

export default connect('store')(Blog);
