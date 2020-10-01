import React from 'react';
import { Link as RLink } from 'react-router-dom';

// Hooks
import { useStores } from 'hooks/mobx';

// mobx
import { observer } from 'mobx-react';

// Custom Components
import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
  MobileUserGreeting,
} from './MobileStyledComponents';
import {
  DesktopNavItem,
  DesktopDropdownMenu,
  DesktopDropdownMenuItem,
} from 'common/Header/NavBar/DesktopNavComponents';

export function MobileRetailNav({ hideNav, handleSignout, userName }) {
  return (
    <>
      <li>
        <MobileUserGreeting userName={userName} />
      </li>
      <li>
        <MobileNavDivider />
      </li>
      <Link to="/retail" onClick={hideNav}>
        Home
      </Link>
      <Link to="/main" onClick={hideNav}>
        Shop
      </Link>
      <li>
        <MobileNavButton onClick={handleSignout}>Sign Out</MobileNavButton>
      </li>
    </>
  );
}

MobileRetailNav.propTypes = {
  hideNav: PropTypes.func.isRequired,
};

export const DesktopRetailNav = observer(() => {
  const { user } = useStores();

  return user.isRetail ? (
    <>
      <DesktopNavItem to="/retail" text="Home" />
      <DesktopNavItem to="/main" text="Shop" />
      <DesktopDropdownMenu>
        {/* TODO: ADD LINKS AS NECESSARY */}
      </DesktopDropdownMenu>
    </>
  ) : null;
});

function Link({ children, ...rest }) {
  return (
    <li>
      <RLink {...rest}>
        <MobileNavLinkText>{children}</MobileNavLinkText>
      </RLink>
    </li>
  );
}
