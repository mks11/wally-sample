import React from 'react';

// Hooks
import { useStores } from 'hooks/mobx';

// mobx
import { observer } from 'mobx-react';

// Custom Components
import { MobileNavMenu } from './MobileNavComponents';
import { DesktopNavItem } from 'common/Header/NavBar/DesktopNavComponents';
import AccountDropdown, {
  AccountDropdownMenuItem,
  AccountDropdownMenuListItem,
} from 'common/Header/NavBar/AccountDropdown';

export const MobileOpsNav = observer(() => {
  const { user } = useStores();
  return user.isOps || user.isOpsLead ? (
    <>
      <MobileNavMenu>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/pick-pack">
            Pick/Pack
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/packaging-returns">
            Packaging Returns
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/manage/co-packing/runs">
            Copacking
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/packaging-inventory">
            Packaging Inventory
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
      </MobileNavMenu>
      <AccountDropdown></AccountDropdown>
      {/* <Cart /> */}
    </>
  ) : null;
});

export const DesktopOpsNav = observer(() => {
  const { user } = useStores();

  return user.isOps || user.isOpsLead ? (
    <>
      <DesktopNavItem to="/pick-pack" text="Pick/Pack" />
      <DesktopNavItem to="/packaging-returns" text="Packaging Returns" />
      <DesktopNavItem to="/manage/co-packing/runs" text="Copacking" />
      <AccountDropdown>
        <AccountDropdownMenuListItem>
          <AccountDropdownMenuItem to="/packaging-inventory">
            Packaging Inventory
          </AccountDropdownMenuItem>
        </AccountDropdownMenuListItem>
      </AccountDropdown>
    </>
  ) : null;
});
