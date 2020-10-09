import styled from 'styled-components';
import { Button } from '@material-ui/core';

export const PrimaryWallyButton = styled(Button).attrs({
  color: 'primary',
  variant: (props) => props.variant || 'contained',
})`
  color: ${(props) => (props.variant === 'outlined' ? '#97adff' : '#fff')};
  border-radius: 50px;
  &:hover {
    color: ${(props) => (props.variant === 'outlined' ? '#97adff' : '#fff')};
    background-color: '#97adff40';
  }
`;

export const PrimaryTextButton = styled(Button).attrs({
  color: 'primary',
})`
  white-space: nowrap;
`;

export const SecondaryWallyButton = styled(Button).attrs({
  color: 'secondary',
  variant: 'contained',
})`
  color: #133063;
  border-radius: 50px;
`;

export const DangerButton = styled(PrimaryWallyButton).attrs({
  variant: 'outlined',
})`
  border-color: #f45246;
  color: #f45246;
  &:hover {
    color: #f45246;
    border-color: #f45246;
    background-color: rgba(244, 82, 70, 0.1);
  }
`;

export const DangerTextButton = styled(Button)`
  color: #f45246;
  white-space: nowrap;
`;

export const ColorfulWallyButton = styled.button`
  background-color: ${(props) => props.bgColor || '#97adff'};
  border: ${(props) =>
    props.bordercolor ? `1px solid ${props.bordercolor}` : 'none'};
  border-color: ${(props) => props.bordercolor || '#97adff'};
  color: ${(props) => props.color || '#fff'};
  border-radius: 50px;
  padding: 0.75em 1em;
  min-width: 100px;
  &:hover {
    color: ${(props) => props.color || '#fff'};
    background-color: ${(props) => `${props.bgColor}` || '#97adff40'};
  }
`;
