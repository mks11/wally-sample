import styled from 'styled-components';
import { Button } from '@material-ui/core';

export const ScanQRButton = styled(Button)`
  min-width: 125px;
  background-color: ${(props) => (props.disabled ? '#42E2B8' : '#2D82B7')};
  opacity: ${(props) => (props.disabled ? '0.7' : '1')};
  color: #fff;
  border-radius: 50px;
`;

export const ScanUPCButton = styled(Button)`
  padding: 1rem;
  background-color: #feefe5;
`;
