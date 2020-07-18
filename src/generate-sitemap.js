const { writeFileSync } = require('fs');
const { resolve } = require('path');
const {
  simpleSitemapAndIndex,
} = require('sitemap')

const urls = [
     "/user",
    //  "/packaging/:id",
     "/schedule-pickup",
     "/invitefriends",
     "/backers",
     "/thankyou",
     "/api/user/reset-password",
     "/verify",
     "/orders",
    //  "/vendor/:vendor_name",
     "/tnc",
     "/privacy",
     "/sell-through-wally",
     "/blog",
    //  "/blog/:id",
    //  "/orders/:id",
     "/help",
     "/help/topics",
    //  "/help/topics/:id",
    //  "/help/detail/:id",
     "/help/question/:question",
     "/about",
     "/cart/add",
     "/refer",
     "/checkout",
     "/giftcard",
     "/main",
     "/main/similar-products",
    //  "/main/:id",
     "/signup",
     "/",
     "/feedback",
     "/servicefeedback",
     "/howitworks",
     "/latest-news",
]
const sourceData = urls.map((url) => ({url}));
const hostname = 'https://thewallyshop.co';
const dest = resolve('./public', 'sitemap.xml');
const { SitemapStream, streamToPromise } = require( 'sitemap' )

// Create a stream to write to
const stream = new SitemapStream( { hostname } )

// Loop over your links and add them to your stream
urls.forEach( url => stream.write( url ) )

// End the stream
stream.end()

// write sitemap.xml file in /public folder
streamToPromise( stream ).then( data => writeFileSync(dest, data.toString()))
