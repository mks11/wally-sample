import { InputLabel } from "@material-ui/core";
import styled from "styled-components";

export const Label = styled(InputLabel)`
  color: ${(props) => (props.disabled ? "#757575" : "#231f20")};
`;
