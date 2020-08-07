const { writeFileSync } = require('fs');
const { resolve } = require('path');
const {
  simpleSitemapAndIndex,
} = require('sitemap')

const urls = [
  "/",
  "/tnc",
  "/privacy",
  "/about",
  "/howitworks",
  "/backers",
  "/blog",
  "/latest-news",
  "/help",
  "/help/topics",
  "/giftcard",
  "/sell-through-wally"
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
