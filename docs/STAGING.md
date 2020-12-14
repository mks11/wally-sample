# Development Lifecycle Overview & Staging Guide

## Introduction

### Terms

**Development**, **Staging**, and **Production** refer to environments developers use to separate the stages of the software development lifecycle.

**Development** refers an environment in which software is actively being developed.

**Staging** refers to an environment in which the initial stages of software development are complete. Usually features at
this stage haven't been thoroughly tested, but are functional enough for users to test out and to vet for bugs. In our case,
the Staging environment refers to our staging [website](https://the-wally-shop-test.firebaseapp.com/) and
[backend](https://evening-bayou-13995.herokuapp.com). The funny name given to the backend was automatically generated
when the backend was first set up.

**Production** refers to the environment our end-product operates in. In our case, the Production environment refers to
the [website](https://thewallyshop.co/) and the [backend](https://the-wally-shop.herokuapp.com) our users are interacting
with to access our end product.

### Lifecycle

When new features are requested, the developer in charge of completing the feature will set up a new Development environment
to complete the work in. We complete this work in a way that allows us to replicate the conditions our software will
eventually operate under, but separates WIP code from any Production level code so that we don't accidentally interrupt to
our service.

We use repositories (basically just places we can store code on the internet) to synchronize changes to our codebase.
Our backend and frontend repositories allow us to switch back and forth between development environments and can intelligently
track which changes belong to which environment. We refer to a development environment as a new 'branch', because all of
the development environments are connected to each other in a tree-like structure.

We have a single branch in each repository (one for frontend, one for backend, though frontend and backend don't need to be separate)
called the staging branch. We designate this branch for our Staging environment. It's used to synchronize changes we want
to make accessible for testing and QA and no development will ever take place directly on the staging branch. When we
think we're ready to test out a new feature, we merge the feature branch into the staging branch and then we release it
so it's accessible to testers.

The process of releasing new code is referred to as 'deployment'. You'll probably hear that word a lot from software developers.
At the end of the day, deployment is the process of publishing some changes on the internet so that they'll be available
to use or interact with.

Once a new feature has been released to staging (which usually involves deploying both frontend and backend code), it's
immediately accesible for use on our staging website. The staging site should resemble the production website as closely as
possible. Again, the staging site is meant to vet any bugs that weren't discovered during development before releasing a
feature to our end-users.

If bugs or changes are requested as a result of staging QA, the changes will be completed in the original development environment
that was created for the feature. Once the changes are complete, the code needs to be merged and released to staging
to run through QA again. Once staging QA is finalized a feature is ready for release to our end users. The feature code
is merged into our Production branch and released by deploying any frontend or backend code the feature relies on.

#### A note about testing

Live testing on the staging branch is currently the only mechanism we use to test frontend code. There are much more
sophisticated ways of automating this process, but the overhead of implementing automated frontend tests is too much
for us to invest in right now.

We generally employ **automated tests** on our backend code because it's easier to implement and maintain them, and it's too
hard to test backend code by just pressing buttons on a website. The term **automated test** refers to some code that's
written to test some other code. In this way, we can write code to specifically replicate conditions we want to use to
test some other feature so we know how it will behave at the end of the day.

## Getting Started

Using the Staging website is simple. Any time you'd like to access it, head over to the [website](https://the-wally-shop-test.firebaseapp.com/)
and wait for about a minute. The Staging site's backend goes to sleep to save energy and money while it's not being used,
so it takes a minute to start up. If you navigate to the staging website and the backend is asleep, you won't be able to
log in or do any shopping, since all of those features rely on the backend to function.

You can sign up for an account on the staging website just as you would on our live website. All information used by the
Staging backend is stored in a separate database, so whatever you do on the Staging site will never be reflected on our
Production website. The product, vendor, and SKU data is a reflection of the real data stored in our Production database
at any given point in time. Each week I dump data from our production database to overwrite the data in our Staging database
so we'll have the latest products, vendors, and inventory information available.

The data on the Staging website is subject to change, because we do use the same Staging database for Development.
I occassionally erase some of the data in the database during development, so don't be alarmed if your orders or carts
are gone at some point, because at the end of the day the Staging site is a tool we use explicitly to test new features.
I usually have no need to erase users, so account information should stay in place semi-permanently, unless the need arises
to offload user data somewhere else.

## Addresses and Payment

Address and Payment management is handled by third party service providers, **Shippo** and **Stripe**, respectively. While using
the Staging website, all data passed through these services is designated as test data. You'll get responses from these
service providers that closely mirror Production responses, but are slightly different due to being entered in test.

While using Shippo in test mode, it cannot generate real tracking data. You'll notice that it issues fake tracking numbers
for any shipments associated with your order by using the generic tracking number 'SHIPPO_TRANSIT' to designate a tracking
number that is still in the transit stage. I haven't spent any time figuring out how to use Shippo tracking in test, but
I think there's a way to take shipments through different stages of the shipping lifecycle. However, Shippo does issue
the same address validation results in test-mode as it does in Production, so your saved addresses will be the same in
either environment.

While using Stripe in test mode, you'll never be able to enter real credit card information. Stripe provides a variety
of card numbers and payment methods you can save to your account to test under different conditions. When using test info,
Stripe will still allow payments to be processed in the same way they would be in Production, but no funds will ever be
collected. Below is a list of cards you can use to test with. Try adding them to your account and using them to make
purchases to see what happens. They can be used either as a guest or as a signed up user. Enter any of the following card
numbers below without spaces to use the card. See [stripe](https://stripe.com/docs/testing).

Visa, Mastercard, Discover, Diners Club, JCB, and UnionPay
**Use any future date as expiration, any three digits for cvc, and any 5 digits for zip.**

- Visa 4242 4242 4242 4242
- Visa Debit 4000 0566 5566 5556
- Mastercard 5555 5555 5555 4444
- Mastercard (2-series) 2223 0031 2200 3222
- Discover 6011 1111 1111 1117
- Discover 6011 0009 9013 9424
- Diners Club 3056 9300 0902 0004
- Diners Club 14 Digit 3622 7206 2716 67
- JCB 3566 0020 2036 0505
- UnionPay 6200 0000 0000 0005

Amex Cards **use any future date as expiration, any four digits for cvc, and any 5 digits for zip.**

- 3782 822463 10005
- 3714 496353 98431

Cards that can be used to test specific errors.
**Use any future date as expiration, any three digits for cvc, and any 5 digits for zip.**

- 4000 0000 0000 0341
  - Can be added to your account, but will be declined if used to place order.
- 4000 0000 0000 0002
  - Card will be declined. Is not allowed to be added to your account
- 4000 000 000 9995
  - Card is declined for having insufficient funds.
- 4000 0000 0000 9987
  - Card is declined for being lost.
- 4000 0000 0000 9979
  - Card is declined for being stolen.
- 4000 0000 0000 0069
  - Charge is declined for card being expired.
- 4000 0000 0000 0127
  - Charge is declined due to incorrect CVC
- 4000 0000 0000 0119
  - Charge is declined due to processing error
- 4242 4242 4242 4241
  - Charge declined due to incorrect card number

## Promotions

At the time of this writing, there are several promo codes that can be tested when making your order.

### Fall Insert Promo Codes

These codes can only be used on your first order. Each of them offers a 15% off discount and can only be used once per person.
Percentages don't stack.

- REUSE_CC
- REUSE_IW
- REUSE_IT
- REUSE_MA
- REUSE_RS
- REUSE_SM

### Store Credit

This code will apply $10 of store credit to your account. Since it's not tied to a cart, it won't be displayed on your
order summary, but will be applied to your order until used up.

- HSBX3H7

### Free Shipping

This code will remove the shipping cost of your order. It should show on your order summary. May only be used once per person.

- MN65HH

### Percentage Discount Off X Number of Items

This code has an item requirement of 12 items. If you apply it, it will be shown on your order summary, but the discount
won't be applied until you've added 12 jars to your cart.

- TWS10_BF_2020

### Other

Testing other promo scenarios can be made possible by request, such as start/expiration dates and maximum usage limits

## Orders & Checkout

You can shop on the Staging site just as you would on our live website. Add items to your cart and checkout just as you
would on our live website. You should receive the same emails you would if you were shopping in Production. Some things
don't work the same way (or at all), like order tracking and our referral program. I haven't dug into either of these things
because we know they work in production and I haven't made any changes to them yet.

## Order Fulfillment & Packaging Return Fulfillment

We do have the ability to simulate this in Staging, but it's much more difficult because you need to have a set of valid QR
codes printed off that are tied to jars in the testing DB. I've accomplished this previously, but it's a feature that's only available
for development purposes.
