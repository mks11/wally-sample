import React, { Component } from 'react';
import Title from '../common/page/Title'
import { connect } from '../utils'

class About extends Component {
  constructor(props, context){
    super(props, context)
    this.userStore = this.props.store.user
    this.routing = this.props.store.routing
  }
  componentDidMount() {
    this.userStore.getStatus()
      .then((status) => {
        // this.loadData()
      })
  }
  render() {
    return (
      <div className="App">
         <Title content="Privacy Policy" />

        <section className="page-section aw-our--story">
          <div className="container">
          


      <p>Effective date: March 20, 2018</p>


      <p>Asta Works Inc. ("us", "we", or "our") operates the www.thewallyshop.co website and the Wally Shop mobile application (the "Service").</p>

      <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>

      <p>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions.</p>




      <h2>Information Collection And Use</h2>

      <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

      <h3>Types of Data Collected</h3>

      <h4>Personal Data</h4>

      <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>

      <ul>
      <li>Email address</li><li>First name and last name</li><li>Phone number</li><li>Address, State, Province, ZIP/Postal code, City</li><li>Cookies and Usage Data</li>
      </ul>

      <p>We may use your Personal Data to contact you with newsletters, marketing or promotional materials and other information that may be of interest to you. You may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send.</p>

      <h4>Usage Data</h4>

      <p>We may also collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Usage Data").</p>
      <p>This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
      <p>When you access the Service by or through a mobile device, this Usage Data may include information such as the type of mobile device you use, your mobile device unique ID, the IP address of your mobile device, your mobile operating system, the type of mobile Internet browser you use, unique device identifiers and other diagnostic data.</p>

      <h4>Location Data</h4>
      <p>We may use and store information about your location if you give us permission to do so (“Location Data”). We use this data to provide features of our Service, to improve and customize our Service.</p>
      <p>You can enable or disable location services when you use our Service at any time, through your device settings.</p>

      <h4>Tracking &amp; Cookies Data</h4>
      <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.</p>
      <p>Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.</p>
      <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
      <p>Examples of Cookies we use:</p>
      <ul>
        <li><strong>Session Cookies.</strong> We use Session Cookies to operate our Service.</li>
        <li><strong>Preference Cookies.</strong> We use Preference Cookies to remember your preferences and various settings.</li>
        <li><strong>Security Cookies.</strong> We use Security Cookies for security purposes.</li>
      </ul>

      <h2>Use of Data</h2>

      <p>Asta Works Inc. uses the collected data for various purposes:</p>    
      <ul>
        <li>To provide and maintain our Service</li>
        <li>To notify you about changes to our Service</li>
        <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
        <li>To provide customer support</li>
        <li>To gather analysis or valuable information so that we can improve our Service</li>
        <li>To monitor the usage of our Service</li>
        <li>To detect, prevent and address technical issues</li>
        <li>To provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information</li></ul>


      <h2>Transfer Of Data</h2>
      <p>Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.</p>
      <p>If you are located outside United States and choose to provide information to us, please note that we transfer the data, including Personal Data, to United States and process it there.</p>
      <p>Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
      <p>Asta Works Inc. will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.</p>

      <h2>Disclosure Of Data</h2>

      <h3>Disclosure for Law Enforcement</h3>
      <p>Under certain circumstances, Asta Works Inc. may be required to disclose your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>

      <h3>Legal Requirements</h3>
      <p>Asta Works Inc. may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
      <ul>
        <li>To comply with a legal obligation</li>
        <li>To protect and defend the rights or property of Asta Works Inc.</li>
        <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
        <li>To protect the personal safety of users of the Service or the public</li>
        <li>To protect against legal liability</li>
      </ul>

      <h2>Security Of Data</h2>
      <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>

      <h2>"Do Not Track" Signals</h2>    
      <p>We do not support Do Not Track ("DNT"). Do Not Track is a preference you can set in your web browser to inform websites that you do not want to be tracked.</p>
      <p>You can enable or disable Do Not Track by visiting the Preferences or Settings page of your web browser.</p>


      <h2>Service Providers</h2>
      <p>We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.</p>
      <p>These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>

      <h3>Analytics</h3>
      <p>We may use third-party Service Providers to monitor and analyze the use of our Service.</p>    
      <ul>
        <li>
          <p><strong>Google Analytics</strong></p>
          <p>Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our Service. This data is shared with other Google services. Google may use the collected data to contextualize and personalize the ads of its own advertising network.</p>
          <p>You can opt-out of having made your activity on the Service available to Google Analytics by installing the Google Analytics opt-out browser add-on. The add-on prevents the Google Analytics JavaScript (ga.js, analytics.js, and dc.js) from sharing information with Google Analytics about visits activity.</p>
          <p>For more information on the privacy practices of Google, please visit the Google Privacy &amp; Terms web page: <a href="http://www.google.com/intl/en/policies/privacy/">http://www.google.com/intl/en/policies/privacy/</a></p>
      </li>
    </ul>




      <h3>Payments</h3>
      <p>We may provide paid products and/or services within the Service. In that case, we use third-party services for payment processing (e.g. payment processors).</p>
      <p>We will not store or collect your payment card details. That information is provided directly to our third-party payment processors whose use of your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, Mastercard, American Express and Discover. PCI-DSS requirements help ensure the secure handling of payment information.</p>
      <p>The payment processors we work with are:</p>
      <ul>
        <li>
          <p><strong>Apple Store In-App Payments</strong></p>
          <p>Their Privacy Policy can be viewed at <a href="https://www.apple.com/legal/privacy/en-ww/">https://www.apple.com/legal/privacy/en-ww/</a></p>
      </li>
      <li>
        <p><strong>Google Play In-App Payments</strong></p>
        <p>Their Privacy Policy can be viewed at <a href="https://www.google.com/policies/privacy/">https://www.google.com/policies/privacy/</a></p>
      </li>
      <li>
        <p><strong>Stripe</strong></p>
        <p>Their Privacy Policy can be viewed at <a href="https://stripe.com/us/privacy">https://stripe.com/us/privacy</a></p>
      </li>
      <li>
        <p><strong>PayPal or Braintree</strong></p>
        <p>Their Privacy Policy can be viewed at <a href="https://www.paypal.com/webapps/mpp/ua/privacy-full">https://www.paypal.com/webapps/mpp/ua/privacy-full</a></p>
      </li>
    </ul>


      <h2>Links To Other Sites</h2>
      <p>Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.</p>
      <p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>


      <h2>Children's Privacy</h2>
      <p>Our Service does not address anyone under the age of 13 ("Children").</p>
      <p>We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>


      <h2>Changes To This Privacy Policy</h2>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      <p>We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.</p>
      <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>


      <h2>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us:</p>
      <ul>
        <li>By email: support@thewallyshop.co</li>

      </ul>
    </div>
  </section>
</div>
);
}
}

export default connect("store")(About);
