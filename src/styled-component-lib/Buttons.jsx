import styled from 'styled-components';
import { Button } from '@material-ui/core';

export const PrimaryWallyButton = styled(Button).attrs({
  color: 'primary',
  variant: 'contained',
})`
  color: #fff;
  border-radius: 50px;
  white-space: nowrap;
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
  white-space: nowrap;
`;

export const DangerButton = styled(PrimaryWallyButton).attrs({
  variant: 'outlined',
})`
  border-color: #f45246;
  color: #f45246;
  white-space: nowrap;
  &:hover {
    color: #f45246;
    border-color: #f45246;
    background-color: rgba(244, 82, 70, 0.1);
  }
`;
