import React from 'react';
import { Typography, List, ListItem, Box } from '@material-ui/core';
import Page from './shared/Page';
import PageSection from 'common/PageSection';

export default function Privacy() {
  return (
    <Page
      title="Privay Policy"
      description="The Wally Shop's privacy policy."
      content="Privacy Policy"
    >
      <Typography color="textSecondary" gutterBottom>
        Effective date: March 20, 2018
      </Typography>

      <PageSection>
        <Typography gutterBottom>
          Asta Works Inc. ("us", "we", or "our") operates the
          www.thewallyshop.co website and the Wally Shop mobile application (the
          "Service").
        </Typography>

        <Typography gutterBottom>
          This page informs you of our policies regarding the collection, use,
          and disclosure of personal data when you use our Service and the
          choices you have associated with that data.
        </Typography>

        <Typography gutterBottom>
          We use your data to provide and improve the Service. By using the
          Service, you agree to the collection and use of information in
          accordance with this policy. Unless otherwise defined in this Privacy
          Policy, terms used in this Privacy Policy have the same meanings as in
          our Terms and Conditions.
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Information Collection And Use
        </Typography>

        <Typography gutterBottom>
          We collect several different types of information for various purposes
          to provide and improve our Service to you.
        </Typography>

        <Typography variant="h3" gutterBottom>
          Types of Data Collected
        </Typography>

        <Typography variant="h4" gutterBottom>
          Personal Data
        </Typography>

        <Typography gutterBottom>
          While using our Service, we may ask you to provide us with certain
          personally identifiable information that can be used to contact or
          identify you ("Personal Data"). Personally identifiable information
          may include, but is not limited to:
        </Typography>

        <List>
          <ListItem>
            <Typography>Email address</Typography>
          </ListItem>
          <ListItem>
            <Typography>First name and last name</Typography>
          </ListItem>
          <ListItem>
            <Typography>Phone number</Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Address, State, Province, ZIP/Postal code, City
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>Cookies and Usage Data</Typography>
          </ListItem>
        </List>

        <Typography gutterBottom>
          We may use your Personal Data to contact you with newsletters,
          marketing or promotional materials and other information that may be
          of interest to you. You may opt out of receiving any, or all, of these
          communications from us by following the unsubscribe link or
          instructions provided in any email we send.
        </Typography>

        <Typography variant="h4" gutterBottom>
          Usage Data
        </Typography>

        <Typography gutterBottom>
          We may also collect information that your browser sends whenever you
          visit our Service or when you access the Service by or through a
          mobile device ("Usage Data").
        </Typography>
        <Typography gutterBottom>
          This Usage Data may include information such as your computer's
          Internet Protocol address (e.g. IP address), browser type, browser
          version, the pages of our Service that you visit, the time and date of
          your visit, the time spent on those pages, unique device identifiers
          and other diagnostic data.
        </Typography>
        <Typography gutterBottom>
          When you access the Service by or through a mobile device, this Usage
          Data may include information such as the type of mobile device you
          use, your mobile device unique ID, the IP address of your mobile
          device, your mobile operating system, the type of mobile Internet
          browser you use, unique device identifiers and other diagnostic data.
        </Typography>

        <Typography variant="h4" gutterBottom>
          Location Data
        </Typography>
        <Typography gutterBottom>
          We may use and store information about your location if you give us
          permission to do so (“Location Data”). We use this data to provide
          features of our Service, to improve and customize our Service.
        </Typography>
        <Typography gutterBottom>
          You can enable or disable location services when you use our Service
          at any time, through your device settings.
        </Typography>

        <Typography variant="h4" gutterBottom>
          Tracking &amp; Cookies Data
        </Typography>
        <Typography gutterBottom>
          We use cookies and similar tracking technologies to track the activity
          on our Service and hold certain information.
        </Typography>
        <Typography gutterBottom>
          Cookies are files with small amount of data which may include an
          anonymous unique identifier. Cookies are sent to your browser from a
          website and stored on your device. Tracking technologies also used are
          beacons, tags, and scripts to collect and track information and to
          improve and analyze our Service.
        </Typography>
        <Typography gutterBottom>
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent. However, if you do not accept cookies,
          you may not be able to use some portions of our Service.
        </Typography>
        <Typography gutterBottom>Examples of Cookies we use:</Typography>
        <List>
          <ListItem>
            <Typography>
              <strong>Session Cookies</strong> to operate our Service.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              <strong>Preference Cookies</strong> to remember your preferences
              and various settings.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              <strong>Security Cookies</strong> for security purposes.
            </Typography>
          </ListItem>
        </List>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Use of Data
        </Typography>

        <Typography gutterBottom>
          Asta Works Inc. uses the collected data for various purposes:
        </Typography>
        <List>
          <ListItem>
            <Typography>To provide and maintain our Service</Typography>
          </ListItem>
          <ListItem>
            <Typography>To notify you about changes to our Service</Typography>
          </ListItem>
          <ListItem>
            <Typography>
              To allow you to participate in interactive features of our Service
              when you choose to do so
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>To provide customer support</Typography>
          </ListItem>
          <ListItem>
            <Typography>
              To gather analysis or valuable information so that we can improve
              our Service
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>To monitor the usage of our Service</Typography>
          </ListItem>
          <ListItem>
            <Typography>
              To detect, prevent and address technical issues
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              To provide you with news, special offers and general information
              about other goods, services and events which we offer that are
              similar to those that you have already purchased or enquired about
              unless you have opted not to receive such information
            </Typography>
          </ListItem>
        </List>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Transfer Of Data
        </Typography>
        <Typography gutterBottom>
          Your information, including Personal Data, may be transferred to — and
          maintained on — computers located outside of your state, province,
          country or other governmental jurisdiction where the data protection
          laws may differ than those from your jurisdiction.
        </Typography>
        <Typography gutterBottom>
          If you are located outside United States and choose to provide
          information to us, please note that we transfer the data, including
          Personal Data, to United States and process it there.
        </Typography>
        <Typography gutterBottom>
          Your consent to this Privacy Policy followed by your submission of
          such information represents your agreement to that transfer.
        </Typography>
        <Typography gutterBottom>
          Asta Works Inc. will take all steps reasonably necessary to ensure
          that your data is treated securely and in accordance with this Privacy
          Policy and no transfer of your Personal Data will take place to an
          organization or a country unless there are adequate controls in place
          including the security of your data and other personal information.
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Disclosure Of Data
        </Typography>

        <Typography variant="h3" gutterBottom>
          Disclosure for Law Enforcement
        </Typography>
        <Typography gutterBottom>
          Under certain circumstances, Asta Works Inc. may be required to
          disclose your Personal Data if required to do so by law or in response
          to valid requests by public authorities (e.g. a court or a government
          agency).
        </Typography>

        <Typography variant="h3" gutterBottom>
          Legal Requirements
        </Typography>
        <Typography gutterBottom>
          Asta Works Inc. may disclose your Personal Data in the good faith
          belief that such action is necessary to:
        </Typography>
        <List>
          <ListItem>
            <Typography>To comply with a legal obligation</Typography>
          </ListItem>
          <ListItem>
            <Typography>
              To protect and defend the rights or property of Asta Works Inc.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              To prevent or investigate possible wrongdoing in connection with
              the Service
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              To protect the personal safety of users of the Service or the
              public
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>To protect against legal liability</Typography>
          </ListItem>
        </List>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Security Of Data
        </Typography>
        <Typography gutterBottom>
          The security of your data is important to us, but remember that no
          method of transmission over the Internet, or method of electronic
          storage is 100% secure. While we strive to use commercially acceptable
          means to protect your Personal Data, we cannot guarantee its absolute
          security.
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          "Do Not Track" Signals
        </Typography>
        <Typography gutterBottom>
          We do not support Do Not Track ("DNT"). Do Not Track is a preference
          you can set in your web browser to inform websites that you do not
          want to be tracked.
        </Typography>
        <Typography gutterBottom>
          You can enable or disable Do Not Track by visiting the Preferences or
          Settings page of your web browser.
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Service Providers
        </Typography>
        <Typography gutterBottom>
          We may employ third party companies and individuals to facilitate our
          Service ("Service Providers"), to provide the Service on our behalf,
          to perform Service-related services or to assist us in analyzing how
          our Service is used.
        </Typography>
        <Typography gutterBottom>
          These third parties have access to your Personal Data only to perform
          these tasks on our behalf and are obligated not to disclose or use it
          for any other purpose.
        </Typography>

        <Typography variant="h3" gutterBottom>
          Analytics
        </Typography>
        <Typography gutterBottom>
          We may use third-party Service Providers to monitor and analyze the
          use of our Service.
        </Typography>
        <List>
          <ListItem>
            <Box>
              <Typography gutterBottom>
                <strong>Google Analytics</strong>
              </Typography>
              <Typography gutterBottom>
                Google Analytics is a web analytics service offered by Google
                that tracks and reports website traffic. Google uses the data
                collected to track and monitor the use of our Service. This data
                is shared with other Google services. Google may use the
                collected data to contextualize and personalize the ads of its
                own advertising network.
              </Typography>
              <Typography gutterBottom>
                You can opt-out of having made your activity on the Service
                available to Google Analytics by installing the Google Analytics
                opt-out browser add-on. The add-on prevents the Google Analytics
                JavaScript (ga.js, analytics.js, and dc.js) from sharing
                information with Google Analytics about visits activity.
              </Typography>
              <Typography gutterBottom>
                For more information on the privacy practices of Google, please
                visit the Google Privacy &amp; Terms web page:{' '}
                <a href="http://www.google.com/intl/en/policies/privacy/">
                  http://www.google.com/intl/en/policies/privacy/
                </a>
              </Typography>
            </Box>
          </ListItem>
        </List>

        <Typography variant="h3" gutterBottom>
          Payments
        </Typography>
        <Typography gutterBottom>
          We may provide paid products and/or services within the Service. In
          that case, we use third-party services for payment processing (e.g.
          payment processors).
        </Typography>
        <Typography gutterBottom>
          We will not store or collect your payment card details. That
          information is provided directly to our third-party payment processors
          whose use of your personal information is governed by their Privacy
          Policy. These payment processors adhere to the standards set by
          PCI-DSS as managed by the PCI Security Standards Council, which is a
          joint effort of brands like Visa, Mastercard, American Express and
          Discover. PCI-DSS requirements help ensure the secure handling of
          payment information.
        </Typography>
        <Typography gutterBottom>
          The payment processors we work with are:
        </Typography>
        <List>
          <ListItem>
            <a href="https://www.apple.com/legal/privacy/en-ww/" alt="Apple">
              <Typography gutterBottom>Apple Store In-App Payments</Typography>
            </a>
          </ListItem>
          <ListItem>
            <a href="https://www.google.com/policies/privacy/" alt="Google">
              <Typography gutterBottom>Google Play In-App Payments</Typography>
            </a>
          </ListItem>
          <ListItem>
            <a href="https://stripe.com/us/privacy" alt="Stripe">
              <Typography gutterBottom>Stripe</Typography>
            </a>
          </ListItem>
          <ListItem>
            <a
              href="https://www.paypal.com/webapps/mpp/ua/privacy-full"
              alt="PayPal"
            >
              <Typography gutterBottom>PayPal</Typography>
            </a>
          </ListItem>
        </List>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Links To Other Sites
        </Typography>
        <Typography gutterBottom>
          Our Service may contain links to other sites that are not operated by
          us. If you click on a third party link, you will be directed to that
          third party's site. We strongly advise you to review the Privacy
          Policy of every site you visit.
        </Typography>
        <Typography gutterBottom>
          We have no control over and assume no responsibility for the content,
          privacy policies or practices of any third party sites or services.
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Children's Privacy
        </Typography>
        <Typography gutterBottom>
          Our Service does not address anyone under the age of 13 ("Children").
        </Typography>
        <Typography gutterBottom>
          We do not knowingly collect personally identifiable information from
          anyone under the age of 13. If you are a parent or guardian and you
          are aware that your Children has provided us with Personal Data,
          please contact us. If we become aware that we have collected Personal
          Data from children without verification of parental consent, we take
          steps to remove that information from our servers.
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Changes To This Privacy Policy
        </Typography>
        <Typography gutterBottom>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </Typography>
        <Typography gutterBottom>
          We will let you know via email and/or a prominent notice on our
          Service, prior to the change becoming effective and update the
          "effective date" at the top of this Privacy Policy.
        </Typography>
        <Typography gutterBottom>
          You are advised to review this Privacy Policy periodically for any
          changes. Changes to this Privacy Policy are effective when they are
          posted on this page.
        </Typography>
      </PageSection>
      <PageSection>
        <Typography variant="h2" gutterBottom>
          Contact Us
        </Typography>
        <Typography gutterBottom>
          If you have any questions about this Privacy Policy,{' '}
          <a href="mailto: info@thewallyshop.co" alt="Please contact us.">
            please contact us.
          </a>
        </Typography>
      </PageSection>
    </Page>
  );
}
