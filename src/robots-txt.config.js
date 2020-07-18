module.exports = {
  policy: [
    {
      userAgent: "*",
      allow: "/",
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
