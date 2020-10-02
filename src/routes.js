import React, { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Mainpage from './pages/Mainpage';
import About from './pages/About';
import LatestNews from './pages/LatestNews';
import HowItWorks from './pages/HowItWorks';
import Account from './pages/Account';
import Help from './pages/Help';
import HelpSingle from './pages/HelpSingle';
import HelpSingleAnswer from './pages/HelpSingleAnswer';
import HelpAnswer from './pages/HelpAnswer';
import ResetPassword from './pages/ResetPassword';
import EmailVerification from './pages/EmailVerification';
import Orders from './pages/Orders';
import ManageOrders from './pages/ManageOrders';
import OrderConfirmation from './pages/OrderConfirmation';
import SimilarProducts from './pages/SimilarProducts';
import Checkout from './pages/Checkout';
import GiftCheckout from './pages/GiftCheckout';
import InviteFriends from './pages/InviteFriends';
import Backers from './pages/Backers';
import Tnc from './pages/Tnc';
import Privacy from './pages/Privacy';
import Blog from './pages/Blog/Blog';
import BlogPost from './pages/Blog/BlogPost';
import CartAdd from './pages/CartAdd';
import ReferFriend from './pages/ReferFriend';
import ManageShopper from './pages/ManageShopper';
import ManagePackaging from './pages/ManagePackaging';
import ManageDelivery from './pages/ManageDelivery';
import ManageBlog from './pages/ManageBlog';
import ManageShipping from './pages/ManageShipping';
import ManagePrinting from './pages/ManagePrinting';
import ManageProducts from './pages/ManageProducts';
import ShoppingAppStep1 from './pages/manage/ShoppingAppStep1';
import ShoppingAppStep2 from './pages/manage/ShoppingAppStep2';
import ShoppingAppStep3 from './pages/manage/ShoppingAppStep3';
import ManageCoPackingRuns from './pages/manage/copacking/CoPackingRuns';
import ManageCoPackingRunsSpecific from './pages/manage/copacking/CoPackingRunsSpecific';
import Signup from './pages/Signup';
import Feedback from './pages/Feedback';
import Receipts from './pages/manage/receipt/Receipts';
import CourierRouting from './pages/courier/CourierRouting';
import VendorProfile from './pages/vendor/VendorProfile';
import OutboundShipments from './pages/manage/shipments/OutboundShipments';
import InboundShipments from './pages/manage/shipments/InboundShipments';
import ManageRetail from './pages/manage/retail/ManageRetail';
import RetailManagementPortal from './pages/retail';

// Pick/Pack
import PickPackPortal from 'pages/pick-pack/PickPackPortal';
import OrderFulfillment from 'pages/pick-pack/OrderFulfillmentPage';

// Packaging Returns
import PackagingReturnsPortal from 'pages/packaging-returns/ReturnsPortal';
import NewPackagingReturn from 'pages/packaging-returns/NewPackagingReturn';

// Packaging Inventory
import PackagingInventoryPortal from 'pages/packaging-inventory/';

// Hooks
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

const OpsRoute = observer(({ component: Component, ...rest }) => {
  const { user } = useStores();
  const { isAuthenticating, isOps, isOpsLead, isAdmin } = user;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isOps || isOpsLead || isAdmin) {
          return <Component {...rest} {...props} />;
        } else if (!isOps && !isOpsLead && !isAdmin && !isAuthenticating) {
          console.log('Unauthorized');
          return (
            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
          );
        }
      }}
    />
  );
});

const RetailRoute = observer(({ component: Component, ...rest }) => {
  const { user } = useStores();
  const { isAuthenticating, isRetail, isAdmin } = user;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isRetail || isAdmin) {
          return <Component {...rest} {...props} />;
        } else if (!isRetail && !isAdmin && !isAuthenticating) {
          return (
            <Redirect to={{ pathname: '/', state: { from: props.location } }} />
          );
        }
      }}
    />
  );
});

function Routes(props) {
  return (
    <Switch>
      {/* ==================== Admin Routes (NOT CRAWLED) ==================== */}
      <Route exact path="/manage/retail" component={ManageRetail} />
      <Route exact path="/manage/printing" component={ManagePrinting} />
      <Route exact path="/manage/shipping" component={ManageShipping} />
      <Route exact path="/manage/shopper" component={ManageShopper} />
      <Route exact path="/manage/packaging" component={ManagePackaging} />
      <Route exact path="/manage/delivery" component={ManageDelivery} />
      <Route exact path="/manage/blog" component={ManageBlog} />
      <Route exact path="/manage/shopping-app-1" component={ShoppingAppStep1} />
      <Route exact path="/manage/shopping-app-2" component={ShoppingAppStep2} />
      <Route exact path="/manage/shopping-app-3" component={ShoppingAppStep3} />
      <Route exact path="/manage/receipts" component={Receipts} />
      <Route exact path="/manage/orders" component={ManageOrders} />
      <Route exact path="/manage/courier-routing" component={CourierRouting} />
      <Route exact path="/manage/products" component={ManageProducts} />
      {/* ==================== Ops Routes (NOT CRAWLED) ==================== */}
      {/* Pick/Pack */}
      <OpsRoute exact path="/pick-pack" component={PickPackPortal} />
      <OpsRoute exact path="/pick-pack/:orderId" component={OrderFulfillment} />
      {/* Packaging Returns */}
      <OpsRoute
        exact
        path="/packaging-returns"
        component={PackagingReturnsPortal}
      />
      <OpsRoute
        exact
        path="/packaging-returns/new"
        component={NewPackagingReturn}
      />
      {/* Packaging Inventory */}
      <OpsRoute
        exact
        path="/packaging-inventory"
        component={PackagingInventoryPortal}
      />
      {/* Copacking */}
      <OpsRoute
        exact
        path="/manage/co-packing/runs"
        component={ManageCoPackingRuns}
      />
      <OpsRoute
        exact
        path="/manage/co-packing/runs/:runId"
        component={ManageCoPackingRunsSpecific}
      />
      {/* Old Copacker Routes */}
      <Route
        exact
        path="/manage/co-packing/outbound"
        component={OutboundShipments}
      />
      <Route
        exact
        path="/manage/co-packing/inbound"
        component={InboundShipments}
      />
      {/* ==================== Retail Routes (NOT CRAWLED) ==================== */}
      <RetailRoute exact path="/retail" component={RetailManagementPortal} />
      {/* ==================== Ambassador Routes (NOT CRAWLED) ==================== */}
      <Route exact path="/packaging/:id" component={Mainpage} />
      {/* Guest Routes (CRAWLED) */}
      <Route exact path="/" component={Homepage} />
      <Route exact path="/tnc" component={Tnc} />
      <Route exact path="/privacy" component={Privacy} />
      <Route exact path="/about" component={About} />
      <Route exact path="/howitworks" component={HowItWorks} />
      <Route exact path="/backers" component={Backers} />
      <Route exact path="/blog" component={Blog} />
      <Route exact path="/latest-news" component={LatestNews} />
      <Route exact path="/help" component={Help} />
      <Route exact path="/help/topics" component={HelpSingle} />
      <Route exact path="/giftcard" component={GiftCheckout} />
      <Route exact path="/sell-through-wally">
        <Redirect to="#!" />
      </Route>
      {/* ==================== User Routes (NOT CRAWLED) ==================== */}
      <Route exact path="/blog/:slug" component={BlogPost} />
      <Route exact path="/orders/:id" component={OrderConfirmation} />
      <Route exact path="/help" component={Help} />
      <Route exact path="/help/topics" component={HelpSingle} />
      <Route exact path="/help/topics/:id" component={HelpSingle} />
      <Route exact path="/help/detail/:id" component={HelpSingleAnswer} />
      <Route exact path="/help/question/:question" component={HelpAnswer} />
      <Route exact path="/help/topics/:id" component={HelpSingle} />
      <Route exact path="/main" component={Mainpage} />
      <Route exact path="/orders" component={Orders} />
      <Route exact path="/orders/:id" component={OrderConfirmation} />
      <Route exact path="/user" component={Account} />
      <Route exact path="/thankyou" component={OrderConfirmation} />
      <Route exact path="/api/user/reset-password" component={ResetPassword} />
      <Route exact path="/vendor/:vendor_name" component={VendorProfile} />
      <Route exact path="/verify" component={EmailVerification} />
      <Route exact path="/cart/add" component={CartAdd} />
      <Route exact path="/refer" component={ReferFriend} />
      <Route exact path="/checkout" component={Checkout} />
      <Route exact path="/main/similar-products" component={SimilarProducts} />
      <Route path="/main/:id" component={Mainpage} />
      <Route exact path="/schedule-pickup" component={Mainpage} />
      {/* Doesn't check if you're already logged in. Assumes you want to sign up */}
      <Route exact path="/invitefriends" component={InviteFriends} />
      {/* Redirects to the above route */}
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/feedback" component={Feedback} />
      <Route exact path="/servicefeedback" component={Feedback} />
      <Route
        exact
        path="/social/:id"
        render={({ match }) => {
          const id = match.params.id;
          if (id.match(/[\w-]{7,14}$/g)) {
            return <Route component={Homepage} />;
          }
        }}
      />
      <Route exact path="/" component={Homepage} />
      <Route component={Homepage} />{' '}
      {/* This catchall will redirect any unidentified routes to the homepage */}
    </Switch>
  );
}

export default Routes;
