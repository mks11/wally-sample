import ReactGA from "react-ga";

/**
 * Log a page view using google analytics
 * @param {String} pathname - the name of the current path
 */
export const logPageView = (pathname) => {
  ReactGA.pageview(pathname);
};

export const logEvent = ({
  category = "",
  action = "",
  value = null,
  label = "",
} = {}) => {
  if (category && action) {
    var GAEvent = { category: category, action: action };
    if (label) GAEvent["label"] = label;
    if (value) GAEvent["value"] = parseFloat(value);
    ReactGA.event(GAEvent);
  }
};

export const logModalView = (modalPath = "") => {
  if (modalPath) {
    ReactGA.modalview(modalPath);
  }
};
