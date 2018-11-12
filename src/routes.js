import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';


import Homepage from './pages/Homepage';
import Mainpage from './pages/Mainpage';
import About from './pages/About';
import Account from './pages/Account';
import Help from './pages/Help';
import HelpSingle from './pages/HelpSingle';
import HelpSingleAnswer from './pages/HelpSingleAnswer';
// import HelpTopics from './pages/HelpTopics';
import HelpAnswer from './pages/HelpAnswer';
import ResetPassword from './pages/ResetPassword';
import Orders from './pages/Orders';
import OrderConfirmation from './pages/OrderConfirmation';
import Checkout from './pages/Checkout';
import InviteFriends from './pages/InviteFriends';
import Tnc from './pages/Tnc';
import Privacy from './pages/Privacy';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CartAdd from './pages/CartAdd';
import ManageShopper from './pages/ManageShopper';
import ManageFulfillment from './pages/ManageFulfillment';
import ManageDelivery from './pages/ManageDelivery';
import ManageBlog from './pages/ManageBlog';
import Signup from './pages/Signup';

export default (
    <Fragment>
        <Route exact path="/manage/shopper" component={ManageShopper} />
        <Route exact path="/manage/fulfillment" component={ManageFulfillment} />
        <Route exact path="/manage/delivery" component={ManageDelivery} />
        <Route exact path="/manage/blog" component={ManageBlog} />
        <Route exact path="/user" component={Account}/>
        <Route exact path="/invitefriends" component={InviteFriends}/>
        <Route exact path="/thankyou" component={OrderConfirmation}/>
        <Route exact path="/api/user/reset-password" component={ResetPassword}/>
        <Route exact path="/orders" component={Orders}/>
        <Route exact path="/tnc" component={Tnc}/>
        <Route exact path="/privacy" component={Privacy}/>
        <Route exact path="/blog" component={Blog}/>
        <Route exact path="/blog/:id" component={BlogPost}/>
        <Route exact path="/orders/:id" component={OrderConfirmation}/>
        <Route exact path="/help" component={Help}/>
        <Route exact path="/help/topics" component={HelpSingle}/>
        <Route exact path="/help/topics/:id" component={HelpSingle}/>
        <Route exact path="/help/detail/:id" component={HelpSingleAnswer}/>
        <Route exact path="/help/question/:question" component={HelpAnswer}/>
        <Route exact path="/about" component={About}/>
        <Route exact path="/cart/add" component={CartAdd}/>
        <Route exact path="/checkout" component={Checkout}/>
        <Route exact path="/main" component={Mainpage}/>
        <Route exact path="/main/:id" component={Mainpage}/>
        <Route exact path="/signup" component={Signup}/>
        <Route exact path="/" component={Homepage}/>
    </Fragment>
);
