import styled from 'styled-components';
import { Button } from '@material-ui/core';

export const PrimaryWallyButton = styled(Button).attrs({
  color: 'primary',
  variant: 'contained',
})`
  color: #fff;
  border-radius: 50px;
  &:hover {
    color: #fff;
  }
`;

export const SecondaryWallyButton = styled(Button).attrs({
  color: 'secondary',
  variant: 'contained',
})`
  color: #133063;
  border-radius: 50px;
`;
