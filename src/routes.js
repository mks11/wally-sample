import React, { Fragment } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Homepage from "./pages/Homepage";
import Mainpage from "./pages/Mainpage";
import About from "./pages/About";
import LatestNews from "./pages/LatestNews";
import HowItWorks from "./pages/HowItWorks";
import Account from "./pages/Account";
import Help from "./pages/Help";
import HelpSingle from "./pages/HelpSingle";
import HelpSingleAnswer from "./pages/HelpSingleAnswer";
import HelpAnswer from "./pages/HelpAnswer";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import Orders from "./pages/Orders";
import ManageOrders from "./pages/ManageOrders";
import OrderConfirmation from "./pages/OrderConfirmation";
import SimilarProducts from "./pages/SimilarProducts";
import Checkout from "./pages/Checkout";
import GiftCheckout from "./pages/GiftCheckout";
import InviteFriends from "./pages/InviteFriends";
import Backers from "./pages/Backers";
import Tnc from "./pages/Tnc";
import Privacy from "./pages/Privacy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CartAdd from "./pages/CartAdd";
import ReferFriend from "./pages/ReferFriend";
import ManageShopper from "./pages/ManageShopper";
import ManagePackaging from "./pages/ManagePackaging";
import ManageDelivery from "./pages/ManageDelivery";
import ManageBlog from "./pages/ManageBlog";
import ManageShipping from "./pages/ManageShipping";
import ManagePrinting from "./pages/ManagePrinting";
import ManageProducts from "./pages/ManageProducts";
import ShoppingAppStep1 from "./pages/manage/ShoppingAppStep1";
import ShoppingAppStep2 from "./pages/manage/ShoppingAppStep2";
import ShoppingAppStep3 from "./pages/manage/ShoppingAppStep3";
import ManageCoPackingRuns from "./pages/manage/copacking/CoPackingRuns";
import ManageCoPackingRunsSpecific from "./pages/manage/copacking/CoPackingRunsSpecific";
import Signup from "./pages/Signup";
import Feedback from "./pages/Feedback";
import Receipts from "./pages/manage/receipt/Receipts";
import CourierRouting from "./pages/courier/CourierRouting";
import VendorProfile from "./pages/vendor/VendorProfile";
import OutboundShipments from "./pages/manage/shipments/OutboundShipments";
import InboundShipments from "./pages/manage/shipments/InboundShipments";
import ManageRetail from "./pages/manage/retail/ManageRetail";

export default (
  <Fragment>
    <Switch>
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
      <Route
        exact
        path="/manage/co-packing/runs"
        component={ManageCoPackingRuns}
      />
      <Route
        exact
        path="/manage/co-packing/runs/:runId"
        component={ManageCoPackingRunsSpecific}
      />
      <Route exact path="/manage/receipts" component={Receipts} />
      <Route exact path="/user" component={Account} />
      <Route exact path="/packaging/:id" component={Mainpage} />
      <Route exact path="/schedule-pickup" component={Mainpage} />
      <Route exact path="/invitefriends" component={InviteFriends} />
      <Route exact path="/backers" component={Backers} />
      <Route exact path="/thankyou" component={OrderConfirmation} />
      <Route exact path="/api/user/reset-password" component={ResetPassword} />
      <Route exact path="/verify" component={EmailVerification} />
      <Route exact path="/orders" component={Orders} />
      <Route exact path="/manage/orders" component={ManageOrders} />
      <Route exact path="/manage/products" component={ManageProducts} />
      <Route exact path="/manage/courier-routing" component={CourierRouting} />
      <Route exact path="/vendor/:vendor_name" component={VendorProfile} />
      <Route exact path="/tnc" component={Tnc} />
      <Route exact path="/privacy" component={Privacy} />
      <Route exact path="/sell-through-wally">
        <Redirect to="#!" />
      </Route>
      <Route exact path="/blog" component={Blog} />
      <Route exact path="/blog/:id" component={BlogPost} />
      <Route exact path="/orders/:id" component={OrderConfirmation} />
      <Route exact path="/help" component={Help} />
      <Route exact path="/help/topics" component={HelpSingle} />
      <Route exact path="/help/topics/:id" component={HelpSingle} />
      <Route exact path="/help/detail/:id" component={HelpSingleAnswer} />
      <Route exact path="/help/question/:question" component={HelpAnswer} />
      <Route exact path="/about" component={About} />
      <Route exact path="/cart/add" component={CartAdd} />
      <Route exact path="/refer" component={ReferFriend} />
      <Route exact path="/checkout" component={Checkout} />
      <Route exact path="/giftcard" component={GiftCheckout} />
      <Route exact path="/main" component={Mainpage} />
      <Route exact path="/main/similar-products" component={SimilarProducts} />
      <Route path="/main/:id" component={Mainpage} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/feedback" component={Feedback} />
      <Route exact path="/servicefeedback" component={Feedback} />
      <Route exact path="/howitworks" component={HowItWorks} />
      <Route exact path="/latest-news" component={LatestNews} />
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
      <Route component={Homepage} /> {/* This catchall will redirect any unidentified routes to the homepage */}
    </Switch>
  </Fragment>
);
