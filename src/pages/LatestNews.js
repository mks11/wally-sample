import React, { Component } from 'react';
import Title from '../common/page/Title';
import ReactGA from 'react-ga';
import { connect, logEvent, logModalView, logPageView } from '../utils'

class About extends Component {
  constructor(props, context){
    super(props, context)
    this.userStore = this.props.store.user
    this.routing = this.props.store.routing
  }
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
  }
  render() {
    return (
      <div className="App">
         <Title content="The Latest News" />
        <section className="page-section aw-our--story">
          <div className="container">
            <div className="tagline">
              <p className="">
                Hi there,
                <br></br>
                <br></br>
                We know times have been tough. With COVID-19 radically changing our day-to-day lives, our team has been trying to think of ways that we can help. Millions of people are struggling to get their basic needs met: many becoming food insecure. That’s why today we’re launching Reusables For All, our plan to help people like you whose lives are being affected by COVID-19. 
                <br></br>
                <br></br>
                We know that having safe access to groceries is a concern for many right now, so we’re completely removing the waitlist from our site! We know many of you have been waiting to place your first order and we’re thrilled to give everyone access to our dreamy purple, gradient website. It’s stocked full of all your favorites, 100% waste-free!! Because we believe everyone should have access to groceries in all reusable packaging. Be patient with us as we work on sourcing more vendors and keeping up our stock in the meantime :) 
                <br></br>
                <br></br>
                In addition, we’re donating $1 to Feeding America for every order you place until April 30th. Feeding America helps millions of Americans access food every day- and we know now more than ever it’s crucial to help this mission. 
                <br></br>
                <br></br>
                Lastly, we want to help the most vulnerable members of our community, so we’re giving our customers who are 65+ that email us at info@thewallyshop.co free shipping on their orders. We want to make sure everyone that needs safe access to groceries has it. 
                <br></br>
                <br></br>
                We hope you’re staying safe during these tough times!
                <br></br>
                <br></br>
                Sending love and light your way,
                <br></br>
                <br></br>
                The Wally Shop Team 
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect("store")(About);
