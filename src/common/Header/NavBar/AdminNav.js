import React from 'react';
import { Link } from 'react-router-dom';

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

export function MobileAdminNav({ hideNav, handleSignout, userName }) {
  return (
    <>
      <li>
        <MobileUserGreeting userName={userName} />
      </li>
      <li>
        <MobileNavDivider />
      </li>
      <li>
        <Link to="/manage/retail" onClick={hideNav}>
          <MobileNavLinkText>Retail</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/co-packing/runs" onClick={hideNav}>
          <MobileNavLinkText>Manage Co-packing Runs</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/shopper" onClick={hideNav}>
          <MobileNavLinkText>Shopper</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/packaging" onClick={hideNav}>
          <MobileNavLinkText>Packing</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/delivery" onClick={hideNav}>
          <MobileNavLinkText>Delivery</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/courier-routing" onClick={hideNav}>
          <MobileNavLinkText>Courier Routing</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/shopping-app-1" onClick={hideNav}>
          <MobileNavLinkText>Shopping App</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/orders" onClick={hideNav}>
          <MobileNavLinkText>Packing App</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/products" onClick={hideNav}>
          <MobileNavLinkText>Products App</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/shipping" onClick={hideNav}>
          <MobileNavLinkText>Shipping</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/printing" onClick={hideNav}>
          <MobileNavLinkText>Printing</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/manage/blog" onClick={hideNav}>
          <MobileNavLinkText>Manage Blogposts</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <MobileNavButton onClick={handleSignout}>Sign Out</MobileNavButton>
      </li>
    </>
  );
}

export const DesktopAdminNav = observer(() => {
  const { user } = useStores();

  return user.isAdmin ? (
    <>
      <DesktopNavItem to="/manage/retail" text="Retail Management" />
      <DesktopNavItem to="/manage/co-packing/runs" text="Copacking" />
      <DesktopNavItem to="/pick-pack" text="Pick/Pack Portal" />
      <DesktopDropdownMenu>
        <DesktopDropdownMenuItem to="/manage/shopper">
          Manage Shoppers
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/packaging">
          Manage Packaging
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/delivery">
          Manage Deliveries
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/courier-routing">
          Manage Courier Routes
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/shopping-app-1">
          Shopping App 1
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/orders">
          Packaging App
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/products">
          Products App
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/shipping">
          Shipping
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/printing">
          Printing
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/manage/blog">
          Manage Blog Posts
        </DesktopDropdownMenuItem>
      </DesktopDropdownMenu>
    </>
  ) : null;
});
