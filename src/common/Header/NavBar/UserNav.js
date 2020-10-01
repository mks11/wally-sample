import React from 'react';
import { Link } from 'react-router-dom';
import { formatMoney } from 'utils';

// Hooks
import { useStores } from 'hooks/mobx';

// mobx
import { observer } from 'mobx-react';

// Services
import { logModalView } from 'services/google-analytics';

// npm Package Components
import { Typography } from '@material-ui/core';

// Custom Components
import {
  MobileNavLinkText,
  MobileNavButton,
  MobileNavDivider,
  MobileUserGreeting,
  MobileUserPackagingBalance,
} from './MobileNavComponents';
import {
  DesktopNavItem,
  DesktopDropdownMenu,
  DesktopDropdownMenuItem,
  DesktopDropdownMenuListItem,
  DesktopDropdownMenuBtn,
} from 'common/Header/NavBar/DesktopNavComponents';
import SchedulePickupForm from 'forms/user-nav/SchedulePickupForm';
import RedeemPackagingBalance from 'forms/user-nav/RedeemPackagingBalance';

export function MobileUserNav({
  hideNav,
  handleSignout,
  handleSchedulePickup,
  userName,
  userStoreCredit,
}) {
  return (
    <>
      <li>
        <MobileUserGreeting userName={userName} />
      </li>
      <li>
        <MobileNavDivider />
      </li>
      <li style={{ padding: '15px 0' }}>
        <MobileUserPackagingBalance balance={userStoreCredit} />
      </li>
      <li>
        <Link to="/orders" onClick={hideNav}>
          <MobileNavLinkText>Order History</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/user" onClick={hideNav}>
          <MobileNavLinkText>Account Settings</MobileNavLinkText>
        </Link>
      </li>
      {/* <li><a onClick={this.handleMobileNavInvite}>Refer your friend, get a tote</a></li> */}
      <li>
        <MobileNavButton onClick={handleSchedulePickup}>
          Schedule Pickup
        </MobileNavButton>
      </li>
      <li>
        <MobileNavButton onClick={handleSignout}>Sign Out</MobileNavButton>
      </li>
      <li>
        <MobileNavDivider />
      </li>
      <li>
        <Link to="/latest-news" onClick={hideNav}>
          <MobileNavLinkText>COVID-19</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/about" onClick={hideNav}>
          <MobileNavLinkText>About</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/howitworks" onClick={hideNav}>
          <MobileNavLinkText>How It Works</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/help" onClick={hideNav}>
          <MobileNavLinkText>Help</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/blog" onClick={hideNav}>
          <MobileNavLinkText>Blog</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/giftcard" onClick={hideNav}>
          <MobileNavLinkText>Gift Card</MobileNavLinkText>
        </Link>
      </li>
      <li>
        <Link to="/backers" onClick={hideNav}>
          <MobileNavLinkText>Our Backers</MobileNavLinkText>
        </Link>
      </li>
    </>
  );
}

const PackagingBalance = observer(() => {
  const { user } = useStores();

  if (user.user && typeof user.user.packaging_balance === 'number') {
    const { packaging_balance } = user.user;
    return (
      <DesktopDropdownMenuListItem>
        <Typography
          align="left"
          style={{ width: '100%', padding: '1.25em 2.25em', cursor: 'default' }}
        >
          Packaging Balance {formatMoney(packaging_balance)}
        </Typography>
      </DesktopDropdownMenuListItem>
    );
  }

  return null;
});

export const DesktopUserNav = observer(() => {
  const { user } = useStores();
  return user.isUser ? (
    <>
      <DesktopNavItem to="/main" text="Shop" />
      <DesktopNavItem to="/blog" text="Blog" />
      <DesktopNavItem to="/help" text="Help" />
      <DesktopNavItem to="/latest-news" text="COVID-19" />
      <DesktopNavItem to="/howitworks" text="How It Works" />
      <DesktopDropdownMenu>
        <DesktopDropdownMenuItem to="/user">
          Account Settings
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/orders">
          Order History
        </DesktopDropdownMenuItem>
        <PackagingBalance />
        <RedeemDepositButton />
        <SchedulePickupButton />
        <DesktopDropdownMenuItem to="/giftcard">
          Gift Cards
        </DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/about">About</DesktopDropdownMenuItem>
        <DesktopDropdownMenuItem to="/backers">
          Our Backers
        </DesktopDropdownMenuItem>
      </DesktopDropdownMenu>
    </>
  ) : null;
});

function SchedulePickupButton({ onClick }) {
  const { modalV2 } = useStores();
  const schedulePickup = () => {
    logModalView('/schedulePickup');
    onClick();
    modalV2.open(<SchedulePickupForm />);
  };
  return (
    <DesktopDropdownMenuBtn onClick={schedulePickup}>
      Schedule Pickup
    </DesktopDropdownMenuBtn>
  );
}

function RedeemDepositButton({ onClick }) {
  const { modalV2 } = useStores();
  const redeemDeposit = () => {
    logModalView('/redeem-deposit');
    onClick();
    modalV2.open(<RedeemPackagingBalance />);
  };

  return (
    <DesktopDropdownMenuBtn onClick={redeemDeposit}>
      Redeem Packaging Balance
    </DesktopDropdownMenuBtn>
  );
}
