module.exports = {
  policy: [
    {
      userAgent: "*",
      allow: [
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
        "/help/detail/:id",
        "/help/question/:question",
        "/help/topics/:id",
        "/giftcard",
        "/sell-through-wally"
      ],
      disallow: [
        // Admin routes
        '/manage/retail',
        '/manage/printing',
        '/manage/shipping',
        '/manage/shopper',
        '/manage/packaging',
        '/manage/delivery',
        '/manage/blog',
        '/manage/shopping-app-1',
        '/manage/shopping-app-2',
        '/manage/shopping-app-3',
        '/manage/co-packing/outbound',
        '/manage/co-packing/inbound',
        '/manage/co-packing/runs',
        '/manage/co-packing/runs/:runId',
        '/manage/orders',
        '/manage/receipts',
        '/manage/products',
        '/manage/courier-routing'
      ]
    },
  ],
  sitemap: "https://thewallyshop.co/sitemap.xml",
  host: "https://thewallyshop.co",
};
