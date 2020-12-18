import styled from 'styled-components';
import { Grid } from '@material-ui/core';

export const ReverseOrderPhotoWrapper = styled(Grid)`
  @media only screen and (max-width: 566px) {
    order: ${(props) => props.order};
  }
`;
