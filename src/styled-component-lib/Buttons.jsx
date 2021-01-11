import styled from 'styled-components';
import React from 'react';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

export const PrimaryWallyButton = styled(Button).attrs((props) => ({
  color: 'primary',
  variant: props.variant || 'contained',
}))`
  color: ${(props) => (props.variant === 'outlined' ? '#97adff' : '#fff')};
  border-radius: 4px;
  white-space: nowrap;
  padding: 0.7em 1.5em;
  &:hover {
    color: ${(props) => (props.variant === 'outlined' ? '#97adff' : '#fff')};
  }
`;

export const PrimaryTextButton = styled(Button).attrs((props) => ({
  color: 'primary',
}))`
  white-space: nowrap;
`;

export const SecondaryWallyButton = styled(Button).attrs((props) => ({
  color: 'secondary',
  variant: 'contained',
}))`
  color: #133063;
  border-radius: 50px;
  white-space: nowrap;
`;

export const DangerButton = styled(PrimaryWallyButton).attrs((props) => ({
  variant: 'outlined',
}))`
  border-color: #f45246;
  color: #f45246;
  white-space: nowrap;
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
  border-radius: 4px;
  padding: 0.7em 1em;
  min-width: 100px;
  &:hover {
    color: ${(props) => props.color || '#fff'};
    background-color: ${(props) => `${props.bgColor}` || '#97adff40'};
  }
`;

export const ActivityButton = ({
  isLoading,
  loadingTitle = 'Submitting...',
  color = 'inherit',
  disabled = true, // default disable while submitting
  children,
  component,
  ...rest
}) => {
  const Comp = component || PrimaryWallyButton;
  if (isLoading) {
    return (
      <Comp disabled={disabled} {...rest}>
        {/**
          Clones a element (like Typography) and sets the
          loadingTitle to be its children
          All variants and styles will be applied to the 'loadingTitle' as well
         */}
        {loadingTitle}
        <CircularProgress
          color={color}
          size={22}
          style={{ marginLeft: '3px' }}
        />
      </Comp>
    );
  } else {
    return <Comp {...rest}>{children} </Comp>;
  }
};
