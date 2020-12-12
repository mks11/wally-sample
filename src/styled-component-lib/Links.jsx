import styled from 'styled-components';
import { Link } from 'react-router-dom';
import theme from 'mui-theme';

export const InternalWallyLink = styled(Link)`
  color: ${theme.palette.primary.main};
`;

export const PrimaryContainedLink = styled(Link)`
  background-color: ${theme.palette.primary.main};
  color: #fff;
  border-radius: 4px;
  padding: 1.25em 1.75em;
  &&& {
    &:hover {
      text-decoration: none;
      background-color: ${theme.palette.primary.dark};
      color: #fff;
    }
  }
`;

export const PrimaryTextLink = styled(Link)`
  background-color: #fff;
  color: ${theme.palette.primary.main};
  border-radius: 4px;
  height: 100%;
  padding: 1.25em 1.75em;
  &&& {
    &:hover {
      text-decoration: none;
      color: ${theme.palette.primary.dark};
    }
  }
`;
