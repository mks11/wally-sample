import styled from "styled-components";
import Typography from "@material-ui/core/Typography";

export const ResponsiveText = styled(Typography)`
  @media only screen and (max-width: 767px) {
    text-align: center;
  }
  @media only screen and (min-width: 768px) {
    text-align: start;
  }
`;
