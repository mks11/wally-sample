import styled from 'styled-components';
import React from 'react';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

export const PrimaryWallyButton = styled(Button).attrs({
  color: 'primary',
  variant: (props) => props.variant || 'contained',
})`
  color: ${(props) => (props.variant === 'outlined' ? '#97adff' : '#fff')};
  border-radius: 50px;
  white-space: nowrap;
  &:hover {
    color: ${(props) => (props.variant === 'outlined' ? '#97adff' : '#fff')};
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

export const ActivityButton = ({
  isLoading,
  loadingTitle = 'Submitting...',
  color,
  disabled = true, // default disable while submitting
  children,
  component,
  loaderProps,
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
        {React.cloneElement(children, {
          children: loadingTitle,
        })}
        {/** Color "white" for the current 'primary' color 
          throws a warning for not being an inherited property
        */}
        <CircularProgress color={color} {...loaderProps} />
      </Comp>
    );
  } else {
    return <Comp {...rest}>{children} </Comp>;
  }
};
