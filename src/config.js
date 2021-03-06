// Set the API base using NODE_ENV (https://create-react-app.dev/docs/adding-custom-environment-variables/)

// NOTES:
// 1. The app is always started in development when `npm run start` is executed.
// 2. The app is always started in production when `npm run build` is executed.

export let BASE_URL = 'http://localhost:4001';
export let STRIPE_API_KEY = 'pk_test_pq5Ha0elSORzrITfK2G7GkK4';
if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://the-wally-shop.herokuapp.com';
  STRIPE_API_KEY = 'pk_live_QV08YsHEj9zFZeHcx3O6X5Wn';
}

export const API_GET_USER = BASE_URL + '/api/user';
export const API_EDIT_USER = BASE_URL + '/api/user';
export const API_SIGNUP = BASE_URL + '/api/signup';
export const API_LOGIN = BASE_URL + '/api/login';
export const API_LOGIN_FACEBOOK = BASE_URL + '/api/login/facebook';
export const API_FORGOT_PASSWORD = BASE_URL + '/api/user/reset-password';
export const API_RESET_PASSWORD = BASE_URL + '/api/user/reset-password/';
export const API_GET_LOGIN_STATUS = BASE_URL + '/api/login/status';
export const API_REFER_FRIEND = BASE_URL + '/api/user/refer';

export const API_PAYMENT_REMOVE = BASE_URL + '/api/user/payment/';

export const API_GET_PRODUCT_DISPLAYED = BASE_URL + '/api/products/';
export const API_GET_HISTORICAL_PRODUCTS =
  BASE_URL + '/api/products/historical';
export const API_GET_PRODUCT_DETAIL = BASE_URL + '/api/product/';
export const API_GET_PACKAGING_UNIT = BASE_URL + '/api/packaging/';
export const API_RATE_PRODUCT = BASE_URL + '/api/products/';

export const API_CATEGORIES_GET = BASE_URL + '/api/categories';
export const API_CATEGORIES_POST = BASE_URL + '/api/category';
export const API_CATEGORIES_UPDATE = BASE_URL + '/api/category';
export const API_CATEGORIES_DELETE = BASE_URL + '/api/category';

export const API_SUBCATEGORIES_GET = BASE_URL + '/api/subcategories';
export const API_SUBCATEGORIES_POST = BASE_URL + '/api/category';
export const API_SUBCATEGORIES_UPDATE = BASE_URL + '/api/category';
export const API_SUBCATEGORIES_DELETE = BASE_URL + '/api/category';

export const API_PACKAGING_LIST = BASE_URL + '/api/packagings';

export const API_SEARCH_KEYWORD = BASE_URL + '/api/products/search';
export const API_REFRESH_INVENTORY = BASE_URL + '/api/products/refresh';

export const API_GET_CURRENT_CART = BASE_URL + '/api/cart';
export const API_EDIT_CURRENT_CART = BASE_URL + '/api/cart/';

export const API_GET_ORDER_SUMMARY = BASE_URL + '/api/order/summary';
export const API_UPDATE_ORDER = BASE_URL + '/api/order/update';
export const API_DELIVERY_TIMES = BASE_URL + '/api/delivery_windows';

export const API_GET_ORDERS = BASE_URL + '/api/orders';
export const API_SUBMIT_ISSUE = BASE_URL + '/api/issue';
export const API_SUBMIT_FEEDBACK = BASE_URL + '/api/order/feedback';
export const API_SUBMIT_SERVICE_FEEDBACK = BASE_URL + '/api/service/feedback';

export const API_SCHEDULE_PICKUP = BASE_URL + '/api/shipping-pickup';

export const API_ADMIN_GET_TIME_FRAMES = BASE_URL + '/api/admin/timeframes';
export const API_ADMIN_GET_SHOP_LOCATIONS =
  BASE_URL + '/api/admin/shopping/locations';
export const API_ADMIN_GET_SHOP_ITEMS =
  BASE_URL + '/api/admin/shopping/shopitems';
export const API_ADMIN_GET_SHOP_ITEMS_FARMS =
  BASE_URL + '/api/admin/shopping/shopitems/farms';
export const API_ADMIN_GET_UNAVAILABLE_SHOP_ITEMS =
  BASE_URL + '/api/admin/shopping/shopitems/unavailable';
export const API_ADMIN_GET_SUB_INFO =
  BASE_URL + '/api/admin/shopping/dailysubstitutes';
export const API_ADMIN_UPDATE_DAILY_SUBSTITUTE =
  BASE_URL + '/api/admin/shopping/dailysubstitutes';
export const API_ADMIN_UPDATE_SHOP_ITEM =
  BASE_URL + '/api/admin/shopping/shopitem';
export const API_ADMIN_GET_PURCHASED_SHOP_ITEMS =
  BASE_URL + '/api/admin/shopping/shopitems/purchased';
export const API_ADMIN_UPDATE_PURCHASED_SHOP_ITEM =
  BASE_URL + '/api/admin/shopping/shopitem/purchased';

export const API_ADMIN_POST_RECEIPT = BASE_URL + '/api/admin/shopping/receipt';
export const API_ADMIN_GET_RECEIPTS = BASE_URL + '/api/admin/shopping/receipt';
export const API_ADMIN_GET_INBOUND_PROD_SHIPMENTS =
  BASE_URL + '/api/admin/co-packing/shipments/inbound';
export const API_ADMIN_GET_OUTBOUND_PROD_SHIPMENTS =
  BASE_URL + '/api/admin/co-packing/shipments/outbound';
export const API_ADMIN_GET_PRINT_EMAIL =
  BASE_URL + '/api/admin/co-packing/print';

export const API_ADMIN_CREATE_COURIER = BASE_URL + '/api/admin/courier';
export const API_ADMIN_UPDATE_SHOP_ITEMS_WAREHOUSE_LOCATIONS =
  BASE_URL + '/api/admin/fulfillment/shopitem/warehouse-location';
export const API_ADMIN_GET_LOCATION_STATUS =
  BASE_URL + '/api/admin/shopping/location/status';
export const API_ADMIN_GET_SHOPPER_PACKAGING_INFO =
  BASE_URL + '/api/admin/shopping/packaging';
export const API_ADMIN_SET_SHOP_ITEM_STATUS =
  BASE_URL + '/api/admin/shopping/shopitem/status';
export const API_ADMIN_GET_ROUTES = BASE_URL + '/api/admin/routes';
export const API_ADMIN_UPDATE_ROUTE_PLACEMENT = BASE_URL + '/api/admin/route';
export const API_ADMIN_GET_ORDER = BASE_URL + '/api/admin/order';
export const API_ADMIN_GET_ORDERS = BASE_URL + '/api/admin/orders';
export const API_ADMIN_GET_PACKAGINGS = BASE_URL + '/api/admin/packagings';
export const API_ADMIN_LINK_PACKAGING =
  BASE_URL + '/api/admin/packaging/link-packaging';
export const API_ADMIN_PACKAGE_ORDER = BASE_URL + '/api/order';
export const API_ADMIN_COMPLETE_ORDER = BASE_URL + '/api/order';
export const API_ADMIN_POST_BLOG_POST = BASE_URL + '/api/admin/blog';
export const API_ADMIN_GET_PRODUCT_SELECTION_DOWNLOAD =
  BASE_URL + '/api/admin/products/currentselectioncsv';
export const API_ADMIN_GET_PRODUCT_CATEGORIES_DOWNLOAD =
  BASE_URL + '/api/admin/products/currentcategoriescsv';
export const API_ADMIN_UPLOAD_SELECTION =
  BASE_URL + '/api/admin/products/selectionupload';

export const API_ADMIN_GET_CO_PACKING_RUNS =
  BASE_URL + '/api/admin/co-packing/runs';
export const API_UPDATE_SKU_UNIT_WEIGHT =
  BASE_URL + '/api/admin/co-packing/sku';
export const API_UPLOAD_COPACKING_QR_CODES =
  BASE_URL + '/api/admin/co-packing/qr-codes';
export const API_GET_UPC_INFO = BASE_URL + '/api/admin/co-packing/vendor-upc';

export const API_RETAIL_UPLOAD_VENDORS = BASE_URL + '/api/admin/retail/vendors';
export const API_RETAIL_UPLOAD_CATEGORIES =
  BASE_URL + '/api/admin/retail/internal';
export const API_RETAIL_UPLOAD_SHIPMENTS =
  BASE_URL + '/api/admin/retail/shipments';
export const API_RETAIL_UPLOAD_PRODUCT_ACTIONS =
  BASE_URL + '/api/admin/retail/product-actions';
export const API_RETAIL_UPLOAD_SKUS = BASE_URL + '/api/admin/retail/skus';

export const API_GET_ADVERTISEMENTS = BASE_URL + '/api/web/ad_display';
export const GET_ZIP_CODES = BASE_URL + '/api/service/zipcodes';

export const API_HELP_GET_QUESTION = BASE_URL + '/api/help/questions/';
export const API_HELP_GET_QUESTION_SINGLE = BASE_URL + '/api/help/questions/';
export const API_HELP_GET_HELP_TOPICS = BASE_URL + '/api/help/topics';
export const API_HELP_GET_CONTACT = BASE_URL + '/api/help/getcontact';
export const API_HELP_SEARCH = BASE_URL + '/api/help/search?search_term=';

export const API_SUBSCRIBE_NOTIFICATIONS = BASE_URL + '/api/email/signup';
export const API_BLOG_POSTS_INDEX = BASE_URL + '/api/blogposts';
export const API_GET_BLOG_POST = BASE_URL + '/api/blogpost/slug';
export const API_EDIT_CART_ITEM = BASE_URL + '/api/order';

export const API_POST_METRIC_SOURCE = BASE_URL + '/api/metric/audience-source';

export const GOOGLE_API_KEY = 'AIzaSyB1VsxMUiBN9H89Qgs5Z1eXtbkCyNB1KGQ';

export const APP_URL = 'https://thewallyshop.co';
export const FB_KEY = '1634254033370820';

export const PRODUCT_BASE_URL =
  'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/product-images/';
export const PACKAGING_BASE_URL =
  'https://s3.us-east-2.amazonaws.com/the-wally-shop-app/packaging-images/';

// Pick Pack Portal
export const API_GET_TODAYS_ORDERS = BASE_URL + '/api/pick-pack/orders/';
export const API_VALIDATE_PICK_PACK_ORDERS =
  BASE_URL + '/api/pick-pack/validate-orders/';
export const API_GET_ORDER_FULFILLMENT_DETAILS =
  BASE_URL + '/api/pick-pack/order-fulfillment/';
export const API_UPDATE_ORDER_FULFILLMENT_DETAILS =
  BASE_URL + '/api/pick-pack/order-fulfillment/';
export const API_VERIFY_ORDER_FULFILLMENT =
  BASE_URL + '/api/pick-pack/order-fulfillment/verify/';

// Packaging Returns Portal
export const API_GET_TODAYS_PACKAGING_RETURNS =
  BASE_URL + '/api/todays-packaging-returns';
export const API_GET_PACKAGING_RETURNS_JOB =
  BASE_URL + '/api/packaging-returns/packaging-returns-job';
export const API_POST_PACKAGING_RETURNS =
  BASE_URL + '/api/packaging-return/submit';

// Cleaning Portal
export const API_UPDATE_PACKAGING_STOCK = BASE_URL + '/api/packaging-stock';
export const API_GET_PACKAGING_STOCK = BASE_URL + '/api/packaging-stocks';

// EMAIL ADDRESSES
export const support = 'info@thewallyshop.co';
