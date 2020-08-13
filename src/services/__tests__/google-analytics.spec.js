import ReactGA from "react-ga";
import * as GAServices from "../google-analytics";

describe("logPageView", () => {
  it("should correctly log the page view", () => {
    ReactGA.initialize(process.env.REACT_APP_GA_PROPERTY_DEFAULT, {
      testMode: true,
    });
    GAServices.logPageView("/");
    expect(ReactGA.testModeAPI.calls).toStrictEqual([
      ["create", process.env.REACT_APP_GA_PROPERTY_DEFAULT, "auto"],
      ["send", { hitType: "pageview", page: "/" }],
    ]);
  });
});
