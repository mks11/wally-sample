// getUser
const getUser = {
  method: "GET",
  response: {
    name: "Test User",
    email: "test.user@gmail.com",
    validated_email: true,
    telephone: "1320990921",
    signup_zip: "10016",
    store_credit: 90.5,
    preferred_payment: "ABC123",
    preferred_address: "1",
    addresses: [
      {
        address_id: "1",
        name: "Test User",
        telephone: "1320990921",
        street_address: "12 Main street",
        unit: "1A",
        zip: "10016",
        city: "New York",
        state: "NY",
        country: "USA",
        delivery_notes: "Leave with doorman"
      },
      {
        address_id: "2",
        name: "Test User",
        telephone: "1320990921",
        street_address: "13 Main street",
        unit: "1A",
        zip: "10017",
        city: "New York",
        state: "NY",
        country: "USA",
        delivery_notes: "Leave with doorman"
      }
    ],
    payments: [
      {
        payment_id: "ABC123",
        cardnumber: "****55321",
        cvv: 233,
        mmyy: "10/19"
      },
      {
        payment_id: "FGH123",
        cardnumber: "****12323",
        cvv: 233,
        mmyy: "08/19"
      }
    ]
  }
};

const editUser = { method: "POST", response: getUser.response };

const signupUser = {
  method: "POST",
  response: {
    token: "ABC123XYZ1432984",
    user: {
      name: "Test User",
      email: "test.user@gmail.com",
      validated_email: false,
      telephone: "",
      signup_zip: "10016",
      store_credit: 0,
      preferred_payment: "",
      preferred_address: "",
      addresses: [],
      payments: []
    }
  }
};

const loginUser = {
  method: "POST",
  response: {
    token: "ABC123XYZ1432984",
    user: {
      name: "Test User",
      email: "test.user@gmail.com",
      validated_email: false,
      telephone: "",
      signup_zip: "10016",
      store_credit: 0,
      preferred_payment: "",
      preferred_address: "",
      addresses: [],
      payments: []
    }
  }
};

const forgotPassword = {
  method: "POST",
  response: {
    success_message: "Check your email!"
  }
};

const updatePassword = {
  method: "POST",
  response: {
    success_message: "Your password has been successfully updated"
  }
};

const getLoginStatus = {
  method: "GET",
  response: { status: true }
};

//add,edit,remove
const addAddress = {
  method: "POST",
  response: getUser.response
};

const getProductDisplayed = {
  methos: "GET",
  response: {
    main_display: [
      {
        cat_id: "123",
        cat_name: "Dairy",
        products: [
          { product_id: "XYZ123", product_name: "Milk" },
          { product_id: "ABC123", product_name: "Cream" }
        ]
      },
      {
        cat_id: "456",
        cat_name: "Produce",
        products: [
          { product_id: "MNO123", product_name: "Lettuce" },
          { product_id: "GHJ123", product_name: "Tomato" }
        ]
      }
    ],
    sidebar: [
      {
        cat_id: "123",
        cat_name: "Dairy",
        sub_cats: [
          { cat_id: "123456", cat_name: "Butter" },
          { cat_id: "123567", cat_name: "Creamer" }
        ]
      }
    ],
    path: ["All", "Dairy"]
  }
};

const getProductDetails = {
  method: "GET",
  response: {
    id: "1234534",
    cat_id: "123",
    subcat_id: "123456",
    name: "Milk",
    producer: "Farmer A",
    description: "Milk from Farmer A in upstate NY.",
    allergens: ["Lactose"],
    taxable: false,
    price: 500,
    price_unit: "unit",
    unit_type: "unit",
    unit_size: "64 Fl oz",
    increment_size: 1,
    min_size: 1,
    final_adj: false,
    packaging_id: "XYZ123",
    packaging_vol: 100,
    in_stock: true,
    std_packaging: "Mason Jar",
    image_refs: ["/images/img-01.jpg", "/images/home2_hd.jpg"],
    available_days: [1],
    farms: ["Lancaster"],
    available_inventory: [
      {
        producer: "Wally Farm",
        shop: "Wally Farm Market",
        price: "1299",
        price_unit: "unit",
        available_times: [
          {
            days_of_weeks: 0,
            start: "10:00:00",
            end: "17:00:00"
          }
        ]
      }
    ],
    addons: [
      {
        name: "Wally Farm",
        description: "Wally Farm Market"
      }
    ],
    delivery_date: "2018-09-15"
  }
};

const getPackagingUnit = {
  method: "GET",
  response: {
    id: "123",
    product_id: "1234534",
    packaging_type_id: "package1"
  }
};

const getCategories = {
  method: "GET",
  response: {
    categories: [
      {
        cat_id: "123",
        cat_name: "Dairy",
        sub_cats: [
          { cat_id: "123456", cat_name: "Butter" },
          { cat_id: "123567", cat_name: "Creamer" }
        ]
      }
    ]
  }
};

const searchKeyword = {
  method: "GET",
  response: {
    products: [
      {
        product_id: "XYZ123",
        product_name: "Milk",
        cat_id: "123",
        subcat_id: "123456"
      },
      {
        product_id: "ABC123",
        product_name: "Cream",
        cat_id: "123",
        subcat_id: "123457"
      }
    ],
    filters: [
      {
        cat_id: "123",
        cat_name: "Dairy",
        sub_cats: [
          { cat_id: "123456", cat_name: "Butter" },
          { cat_id: "123567", cat_name: "Creamer" }
        ]
      }
    ]
  }
};

const refreshInventory = {
  method: "GET",
  response: { message: "Success" }
};

const getCurrentCart = {
  method: "GET",
  response: {
    id: "123456",
    user_id: "ABC123",
    subtotal: 5000,
    packaging_deposit: 120,
    status: "open",
    cart_items: [
      {
        product_id: "4BC123",
        product_name: "Cream",
        product_price: 200,
        customer_quantity: 2,
        total: 400
      },
      {
        product_id: "ABC123",
        product_name: "Milk",
        product_price: 500,
        customer_quantity: 2,
        total: 1000
      }
    ]
  }
};

const editCurrentCart = {
  method: "POST",
  reponse: {
    id: "123456",
    user_id: "ABC123",
    subtotal: 5000,
    packaging_deposit: 120,
    status: "open",
    cart_items: [
      {
        product_id: "ABC123",
        product_name: "Milk",
        product_price: 500,
        customer_quantity: 2,
        total: 1000
      }
    ]
  }
};

const createOrder = {
  method: "POST",
  response: {
    id: "123456",
    user_id: "ABC123",
    cart_id: "ABC123",
    subtotal: 1560,
    promo: "",
    promo_discount: 0,
    service_amount: 0,
    tax_amount: 0,
    packaging_deposit: 120,
    applied_store_credit: 0,
    total: 1680,
    user_name: "",
    telephone: "",
    street_address: "",
    unit: "",
    zip: "",
    city: "",
    state: "",
    country: "",
    delivery_notes: "",
    delivery_time: "",
    payment_method: "XYZABC",
    status: "open",
    cart_items: [
      {
        product_id: "ABC123",
        product_name: "Milk",
        product_price: 500,
        customer_quantity: 2,
        total: 1000
      }
    ],
    applicable_store_credit: 150
  }
};

const getOrderSummary = {
  method: "GET",
  response: {
    id: "123456",
    user_id: "ABC123",
    cart_id: "ABC123",
    subtotal: 1560,
    promo: "",
    promo_discount: 0,
    service_amount: 399,
    tax_amount: 0,
    packaging_deposit: 120,
    applied_store_credit: 200,
    total: 1879,
    user_name: "Test User",
    telephone: "3457658900",
    street_address: "1 Test St",
    unit: "",
    zip: "10016",
    city: "New York",
    state: "NY",
    country: "USA",
    delivery_notes: "Leave with doorman",
    delivery_time: "2018-07-31 18:00-19:00",
    payment_method: "XYZABC",
    status: "open",
    cart_items: [
      {
        product_id: "ABC123",
        product_name: "Milk",
        product_price: 500,
        customer_quantity: 2,
        total: 1000
      }
    ],
    applicable_store_credit: 150
  }
};

const updateOrder = {
  method: "POST",
  response: createOrder.response
};

const getValidZipCodes = {
  method: "GET",
  response: [
    1111,
    1115,
    1116,
    1117,
    1112,
    1118,
    1119,
    1120,
    1113,
    1121,
    1122,
    1123,
    1114,
    1124,
    1125,
    1126,
    1114,
    1124,
    1125,
    1126,
    1114,
    1124,
    1125,
    1126
  ]
};

const getAdvertisements = {
  method: "GET",
  response: {
    ads1: "/images/shop_banner_1.png",
    ads2: "/images/shop_banner_2.png"
  }
};

const subscribeEmail = {
  method: "POST",
  success_message: "Keep an eye out for new announcements!"
};

const QA = {
  text: "is everything packaged in reusable containers?",
  link: "/help/question/1",
  answer: "hello world"
};
const getQuestions = {
  method: "GET",
  response: [QA, QA, QA]
};

const getQuestion = {
  method: "GET",
  response: QA
};

const getHelpTopics = {
  method: "GET",
  response: [
    { text: "Account", link: "account" },
    { text: "Orders", link: "orders" },
    { text: "Charges", link: "charges" },
    { text: "The Wally Shop Service", link: "thewallyshopservice" },
    { text: "Trust & Safety", link: "trustandsafety" }
  ]
};

const getContact = {
  method: "GET",
  response: [{ text: "Email", link: "hahah", icon: "fa-envelope" }]
};

const checkPromo = {
  method: "GET",
  response: { success: true }
};

const searchHelp = {};
const helpTopics = {};
const helpAnswers = {};

const getTimeFrames = {
  method: "GET",
  response: {
    timeframes: ["2018-10-18, 4:00-5:00PM"]
  }
};

const getShopLocations = {
  method: "GET",
  response: {
    locations: ["Union Square", "Fort Greene"]
  }
};

const getShopItems = {
  method: "GET",
  response: {
    shop_items: [
      {
        product_id: "prod_123",
        inventory_id: "invetory_123",
        organic: true,
        product_name: "Awesome product",
        product_producer: "Farm B",
        product_price: 450,
        missing: true,
        box_number: "ABC213",
        substitute_for_name: null,
        product_substitute_reason: "",
        farm_substitue_reason: "",
        price_substitute_reason: "",
        product_missing_reason: "",
        price_unit: "1 Ct",
        quantity: 16,
        warehouse_placement: null
      },
      {
        product_id: "prod_456",
        inventory_id: "invetory_567",
        organic: true,
        product_name: "Awesome product 2",
        product_producer: "Farm A",
        product_price: 345,
        missing: false,
        box_number: "XYZ213",
        substitute_for_name: null,
        product_substitute_reason: "",
        farm_substitue_reason: "",
        price_substitute_reason: "",
        product_missing_reason: "",
        price_unit: "1 Ct",
        quantity: 9,
        warehouse_placement: "Somewhere else"
      }
    ]
  }
};

const getShopItemsFarms = {
  method: "GET",
  response: {
    farms: {
      prod_123: ["Farm A", "Farm B"]
    }
  }
};

const updateShopItem = {
  method: "PATCH",
  response: {}
};

const updateShopItemQuantity = {
  method: "PATCH",
  response: {}
};

const updateShopItemsWarehouseLocations = {
  method: "PATCH",
  response: {}
};

const getRoutes = {
  method: "GET",
  response: [
    {
      id: "route1",
      route_number: "Route 1",
      status: "packed",
      route_placement: "",
      delivery_date: "",
      order_ids: []
    },
    {
      id: "route2",
      route_number: "Route 2",
      status: "packed",
      route_placement: "",
      delivery_date: "",
      order_ids: []
    },
    {
      id: "route3",
      route_number: "Route 3",
      status: "incomplete",
      route_placement: "",
      delivery_date: "",
      order_ids: []
    }
  ]
};

const getRouteOrders = {
  method: "GET",
  response: [
    {
      id: "123456",
      user_id: "ABC123",
      cart_id: "ABC123",
      subtotal: 1560,
      promo: "",
      promo_discount: 0,
      service_amount: 399,
      tax_amount: 0,
      packaging_deposit: 120,
      applied_store_credit: 200,
      total: 1879,
      user_name: "Test User",
      telephone: "3457658900",
      street_address: "1 Test St",
      unit: "",
      zip: "10016",
      city: "New York",
      state: "NY",
      country: "USA",
      delivery_notes: "Leave with doorman",
      delivery_time: "2018-07-31 18:00-19:00",
      payment_method: "XYZABC",
      status: "submitted",
      cart_items: [
        {
          product_id: "ABC123",
          product_name: "Milk",
          product_price: 500,
          customer_quantity: 2,
          total: 1000
        }
      ],
      applicable_store_credit: 150
    },
    {
      id: "789012",
      user_id: "ABC123",
      cart_id: "ABC123",
      subtotal: 1560,
      promo: "",
      promo_discount: 0,
      service_amount: 399,
      tax_amount: 0,
      packaging_deposit: 120,
      applied_store_credit: 200,
      total: 1879,
      user_name: "Test User",
      telephone: "3457658900",
      street_address: "1 Test St",
      unit: "",
      zip: "10016",
      city: "New York",
      state: "NY",
      country: "USA",
      delivery_notes: "Leave with doorman",
      delivery_time: "2018-07-31 18:00-19:00",
      payment_method: "XYZABC",
      status: "packaged",
      cart_items: [
        {
          product_id: "ABC123",
          product_name: "Milk",
          product_price: 500,
          customer_quantity: 2,
          total: 1000
        }
      ],
      applicable_store_credit: 150
    }
  ]
};

const updateRoutePlacement = {
  method: "PATCH",
  response: {}
};

const getOrder = {
  method: "GET",
  response: {
    id: "789012",
    user_id: "ABC123",
    cart_id: "ABC123",
    subtotal: 1560,
    promo: "",
    promo_discount: 0,
    service_amount: 399,
    tax_amount: 0,
    packaging_deposit: 120,
    applied_store_credit: 200,
    total: 1879,
    user_name: "Test User",
    telephone: "3457658900",
    street_address: "1 Test St",
    unit: "",
    zip: "10016",
    city: "New York",
    state: "NY",
    country: "USA",
    delivery_notes: "Leave with doorman",
    delivery_time: "2018-07-31 18:00-19:00",
    payment_method: "XYZABC",
    status: "packaged",
    cart_items: [
      {
        product_id: "ABC123",
        product_name: "Milk",
        product_price: 500,
        customer_quantity: 2,
        total: 1000
      }
    ],
    applicable_store_credit: 150
  }
};

const getPackagings = {
  method: "GET",
  response: [
    {
      id: "package1",
      type: "Tote Bag",
      description: "Package description 1",
      deposit_amount: 370
    },
    {
      id: "package2",
      type: "Mesh bag",
      description: "Package description 2",
      deposit_amount: 270
    },
    {
      id: "package3",
      type: "Stasher bag",
      description: "Package description 3",
      deposit_amount: 310
    }
  ]
};

const packageOrder = {
  method: "PATCH",
  response: {}
};

const completeOrder = {
  method: "PATCH",
  response: {}
};

const getInboundProductShipments = {
  method: "GET",
  response: [
    {
      from_address: {
        name: "Billy Home"
      },
      edd: "Edd",
      type: "Priority",
      delivery_window: "10:00am - 1:00pm"
    },
    {
      from_address: {
        name: "Billy Home"
      },
      edd: "Edd",
      type: "Priority",
      delivery_window: "10:00am - 1:00pm"
    }
  ]
};

const getOutboundProductShipments = {
  method: "GET",
  response: [
    {
      shipmentId: "ABCD123",
      address: "101 New York Drive, NY NY 12345",
      carrier: "UPS",
      tracking_number: "12j03cd",
      Products: [
        { name: "Brown Lentils", jar_quantity: 5, case_quantity: 3 },
        { name: "Grey Lentils", jar_quantity: 3, case_quantity: 1 },
        { name: "Jemima Lentils", jar_quantity: 4, case_quantity: 9 }
      ],
      packing_list_url: "https://ups.com"
    },
    {
      shipmentId: "ABCD456",
      address: "211 Brooklyn Drive, NY NY 12345",

      carrier: "Fed Ex",
      tracking_number: "zz82hnodo",
      Products: [
        { name: "Green Lentils", jar_quantity: 5, case_quantity: 3 },
        { name: "Red Lentils", jar_quantity: 3, case_quantity: 1 },
        { name: "Blue Lentils", jar_quantity: 6, case_quantity: 9 }
      ],
      packing_list_url: "https://ups.com"
    },
    {
      shipmentId: "ABCD789",
      address: "211 Brooklyn Drive, NY NY 12345",

      carrier: null,
      tracking_number: null,
      Products: [
        { name: "Green Lentils", jar_quantity: 5, case_quantity: 3 },
        { name: "Red Lentils", jar_quantity: 3, case_quantity: 1 },
        { name: "Blue Lentils", jar_quantity: 6, case_quantity: 9 }
      ],
      packing_list_url: "https://ups.com"
    }
  ]
};

const updateProductShipment = {
  method: "PATCH",
  response: ["success"]
};

const getBlogPosts = {
  method: "GET",
  response: [
    {
      id: "blog1",
      author: "Anonymous",
      title: "Hello World!",
      body: "<h1>Hello</h1> Here goes example text",
      image_ref: "full/listnk/address",
      live: true,
      post_date: "2018-10-19"
    },
    {
      id: "blog2",
      author: "Anonymous Wolf",
      title: "Check this out!",
      body: "<h1>HI</h1> This is another blog poset text with <strong>strong</strong> text included",
      image_ref: "full/listnk/address2",
      live: true,
      post_date: "2018-10-18"
    }
  ]
};

const postBlogPost = {
  method: "POST",
  response: {
    id: "blog2",
    author: "Anonymous Wolf",
    title: "Check this out!",
    body: "<h1>HI</h1> This is another blog poset text with <strong>strong</strong> text included",
    image_ref: "full/listnk/address2",
    live: true,
    post_date: "2018-10-18"
  }
};

const updateCartItem = {
  method: "PATCH",
  response: {}
};

module.exports = {
  "/api/user": getUser,
  "/api/user/edit": editUser,
  "/api/user/signup": signupUser,
  "/api/user/login": loginUser,
  "/api/user/forgot_password": forgotPassword,
  "/api/user/update_password": updatePassword,
  "/api/user/get_login_status": getLoginStatus,
  "/api/user/address/new": addAddress,
  "/api/user/address/edit": addAddress,
  "/api/user/address/remove": addAddress,
  "/api/user/payment/add": addAddress,
  "/api/user/payment/edit": addAddress,
  "/api/user/payment/remove": addAddress,

  "/api/products": getProductDisplayed,
  "/api/products/categories": getCategories,
  "/api/products/search/:keyword": searchKeyword,
  "/api/products/refresh": refreshInventory,
  "/api/products/:id": getProductDisplayed,
  "/api/product/:id": getProductDetails,

  "/api/packaging/:id": getPackagingUnit,

  "/api/cart/": getCurrentCart,
  "/api/cart/edit": editCurrentCart,

  "/api/order/new": createOrder,
  "/api/order/:id": getOrderSummary,
  "/api/order/update": updateOrder,

  "/api/get_valid_zip_codes": getValidZipCodes,
  "/api/get_advertisements": getAdvertisements,

  "/api/email/signup": subscribeEmail,

  "/api/help/questions": getQuestions,
  "/api/help/question/:id": getQuestion,
  "/api/help/gethelptopics": getHelpTopics,
  "/api/help/getcontact": getContact,

  "/api/admin/timeframes": getTimeFrames,
  "/api/admin/shopping/locations": getShopLocations,
  "/api/admin/shopping/shopitems": getShopItems,
  "/api/admin/shopping/shopitems/farms": getShopItemsFarms,
  // "/api/admin/shopping/shopitem/status/:shopitem_id": setShopItemStatus,
  "/api/admin/shopping/shopitem/:id": updateShopItem,
  "/api/admin/shopping/shopitem/:id/quantity": updateShopItemQuantity,
  "/api/admin/fulfillment/shopitem/warehouse-location": updateShopItemsWarehouseLocations,
  "/api/admin/routes": getRoutes,
  "/api/admin/route/orders": getRouteOrders,
  "/api/admin/route/:id/placement": updateRoutePlacement,
  "/api/admin/order/:id": getOrder,
  "/api/admin/packagings": getPackagings,

  "/api/admin/co-packing/shipments/inbound": getInboundProductShipments,
  "/api/admin/co-packing/shipments/outbound": getOutboundProductShipments,
  "/api/admin/shipments/:id": updateProductShipment,

  //Todo:link packaging
  "/api/order/:id/package": packageOrder,
  "/api/order/:id/complete": completeOrder,

  "/api/blog": getBlogPosts,
  "/api/admin/blog": postBlogPost,
  "/api/order/:order_id/:cartitem_id": updateCartItem
};
