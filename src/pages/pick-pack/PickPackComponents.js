import styled from 'styled-components';
import { Paper, Button, Grid, Typography } from '@material-ui/core';

export const ScanQRButton = styled(Button)`
  background-color: ${(props) => (props.disabled ? '#079d72' : '#97adff')};
  opacity: ${(props) => (props.disabled ? '0.7' : '1')};
  color: #fff;
  border-radius: 50px;
`;

export const ScanUPCButton = styled(Button)`
  padding: 1rem;
  background-color: #feefe5;
`;
