import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

function Head({
  htmlAttributes,
  description,
  meta = [],
  title,
  children,
  props,
}) {
  // Check if the current url matches the homepage url
  const isHomepage = () => window.location.pathname === "/";

  return (
    <Helmet
      htmlAttributes={{ lang: "en", ...htmlAttributes }}
      title={title}
      titleTemplate={isHomepage() ? `%s` : `%s | The Wally Shop`}
      meta={[
        {
          name: `description`,
          content: description,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: description,
        },
        {
          property: `og:type`,
          content: `website`,
        },
      ].concat(meta)}
      {...props}
    >
      {children}
    </Helmet>
  );
}

Head.propTypes = {
  children: PropTypes.element,
  description: PropTypes.string.isRequired,
  htmlAttributes: PropTypes.object,
  meta: PropTypes.array,
  title: PropTypes.string.isRequired,
  props: PropTypes.any,
};

Head.defaultProps = {
  title: "The Wally Shop",
  description:
    "Your favorite grocery brands delivered nationwide in 100% reusable packaging.",
};

export default Head;
