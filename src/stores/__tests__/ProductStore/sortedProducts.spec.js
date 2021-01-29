import { sortProducts } from 'stores/ProductStore';
import {
  A_TO_Z,
  NEWEST,
  HIGH_TO_LOW_PRICE,
  LOW_TO_HIGH_PRICE,
} from 'common/ProductAssortment/SortAndFilterMenu/sorting-config';

describe('Products should be able to correctly sort', () => {
  it('# HIGH_TO_LOW', () => {
    const result = sortProducts(
      RESPONSE_RANDOMLY_ORDERED_FOR_PRICE.products,
      HIGH_TO_LOW_PRICE,
    );

    expect(result).toEqual(
      RESPONSE_RANDOMLY_ORDERED_FOR_PRICE__EXPECTED_HIGH_TO_LOW.products,
    );
  });

  it('# Sold Out Case: HIGH_TO_LOW: should not affect anything', () => {
    const result = sortProducts(
      RESPONSE_RANDOMLY_ORDERED_FOR_PRICE_SOLD_OUT.products,
      HIGH_TO_LOW_PRICE,
    );

    expect(result).toEqual(
      RESPONSE_RANDOMLY_ORDERED_FOR_PRICE_SOLD_OUT__EXPECTED_HIGH_TO_LOW.products,
    );
  });

  it('# LOW_TO_HIGH', () => {
    const result = sortProducts(
      RESPONSE_RANDOMLY_ORDERED_FOR_PRICE.products,
      LOW_TO_HIGH_PRICE,
    );

    expect(result).toEqual(
      RESPONSE_RANDOMLY_ORDERED_FOR_PRICE__EXPECTED_LOW_TO_HIGH.products,
    );
  });

  it('# A_TO_Z', () => {
    const result = sortProducts(
      RESPONSE_RANDOMLY_ORDERED_FOR_ALPHABET.products,
      A_TO_Z,
    );

    expect(result).toEqual(
      RESPONSE_RANDOMLY_ORDERED_FOR_ALPHABET__EXPECTED_A_TO_Z.products,
    );
  });

  it('# NEWEST', () => {
    const result = sortProducts(
      RESPONSE_RANDOMLY_ORDERED_FOR_NEWNESS.products,
      NEWEST,
    );
    expect(result).toEqual(
      RESPONSE_RANDOMLY_ORDERED_FOR_NEWNESS__EXPECTED.products,
    );
  });
});

const RESPONSE = {
  products: [
    {
      cat_ids: ['113928', '919957'],
      display_cats: [],
      organic: false,
      local: true,
      allergens: ['tree nuts'],
      taxable: false,
      unit_weights: [],
      unit_counts: [],
      increment_size: 1,
      min_size: 1,
      final_adj: false,
      packaging_id: [],
      packaging_vol: [],
      image_refs: ['prod_117-1.jpg'],
      nutrition_facts: [],
      ingredient_labels: [],
      add_ons: [],
      buy_by_packaging: false,
      fbw: false,
      ingredients: ['100% Organic Blanched Almonds'],
      is_ecomm: false,
      vendor_id: '5e5bd2c44e54321590714d1a',
      vendor_upc: '',
      tags: ['organic', 'non gmo', 'vegan', 'regionally sourced'],
      lifestyles: ['Gluten-Free', 'Peanut-Free', 'Dairy-Free'],
      values: ['Organic', 'Non-GMO', 'Vegan', 'Regionally Sourced'],
      _id: '5e5bd5ef788da01624c225d8',
      product_id: 'prod_117',
      product_num: 117,
      subcat_id: '562471',
      name: 'Upcycled Blanched Almond Flour',
      description:
        'Our upcycled flour is made using the byproduct of our fresh almond milk, giving it a beautiful white color.',
      unit_type: 'ea',
      vendor: 'NotMilk',
      manufacturer: 'NotMilk NYC',
      bulk_price: 1350,
      shelf_life: 180,
      origin: 'Long Island City, NY, 11101',
      characteristic_id: '5dfa48bdc3d5b10917b9438d',
      createdAt: '2020-03-01T15:34:07.530Z',
      updatedAt: '2020-10-08T19:24:23.956Z',
      __v: 5,
      manufacturer_url_name: 'notmik_nyc',
      density: 0.03,
      inventory: [
        {
          live: true,
          seasonal_months: [],
          consecutive_miss: 0,
          _id: '5ec125eb326f88000496f1ac',
          product_id: 'prod_117',
          packaging_type_id: '5dfa48b8c3d5b10917b9434a',
          packaging_type: '32 oz Wally Jar',
          upc_code: '810043102193',
          price: 1161,
          unit_weight: 0.86,
          available_times: [],
          createdAt: '2020-05-17T11:54:19.823Z',
          updatedAt: '2021-01-13T13:45:44.198Z',
          __v: 0,
          current_inventory: 3,
          current_inventory_ny: 55,
          isAvailable: true,
          id: '5ec125eb326f88000496f1ac',
        },
      ],
      subcategory: {
        _id: '5dfa48bcc3d5b10917b94370',
        category_id: '562471',
        name: 'Flour',
        id: '5dfa48bcc3d5b10917b94370',
      },
      vendorFull: {
        _id: '5e5bd2c44e54321590714d1a',
        name: 'NotMilk',
      },
      id: '5e5bd5ef788da01624c225d8',
    },
    {
      cat_ids: ['113928', '324889', '117099'],
      display_cats: [],
      organic: false,
      local: true,
      allergens: ['tree nuts'],
      taxable: false,
      unit_weights: [],
      unit_counts: [],
      increment_size: 1,
      min_size: 1,
      final_adj: false,
      packaging_id: [],
      packaging_vol: [],
      image_refs: ['prod_118-1.jpg'],
      nutrition_facts: [],
      ingredient_labels: [],
      add_ons: [],
      buy_by_packaging: false,
      fbw: false,
      ingredients: ['100% Organic Blanched Almonds'],
      is_ecomm: false,
      vendor_id: '5e5bd2c44e54321590714d1a',
      vendor_upc: '',
      tags: ['organic', 'non gmo', 'vegan', 'regionally sourced'],
      lifestyles: ['Dairy-Free', 'Gluten-Free', 'Peanut-Free'],
      values: ['Organic', 'Non-GMO', 'Vegan', 'Regionally Sourced'],
      _id: '5e5bd5ef788da01624c225dc',
      product_id: 'prod_118',
      product_num: 118,
      subcat_id: '254064',
      name: 'Upcycled Almond Butter',
      description:
        'Our upcycled butter is made using the byproduct of our fresh almond milk and lightly toasted to enhance the naturally nutty taste.',
      unit_type: 'ea',
      vendor: 'NotMilk',
      manufacturer: 'NotMilk',
      bulk_price: 1600,
      shelf_life: 180,
      origin: 'Long Island City, NY, 11101',
      characteristic_id: '5dfa48bec3d5b10917b943af',
      createdAt: '2020-03-01T15:34:07.688Z',
      updatedAt: '2020-10-21T18:45:07.071Z',
      __v: 6,
      manufacturer_url_name: 'notmik_nyc',
      density: 0.06,
      instruction: '',
      inventory: [
        {
          live: true,
          seasonal_months: [],
          consecutive_miss: 0,
          _id: '5ec125eb326f88000496f1ab',
          product_id: 'prod_118',
          packaging_type_id: '5dfa48b8c3d5b10917b9434b',
          packaging_type: '16 oz Wally Jar',
          upc_code: '810043102186',
          price: 1584,
          unit_weight: 0.99,
          available_times: [],
          createdAt: '2020-05-17T11:54:19.699Z',
          updatedAt: '2021-01-13T13:45:44.222Z',
          __v: 0,
          current_inventory: 7,
          current_inventory_ny: 0,
          isAvailable: true,
          id: '5ec125eb326f88000496f1ab',
        },
      ],
      subcategory: {
        _id: '5dfa48bbc3d5b10917b94364',
        category_id: '254064',
        name: 'Nut Butters',
        id: '5dfa48bbc3d5b10917b94364',
      },
      vendorFull: {
        _id: '5e5bd2c44e54321590714d1a',
        name: 'NotMilk',
      },
      id: '5e5bd5ef788da01624c225dc',
    },
    {
      cat_ids: ['113928', '324889', '117099'],
      display_cats: [],
      organic: false,
      local: true,
      allergens: ['tree nuts'],
      taxable: false,
      unit_weights: [],
      unit_counts: [],
      increment_size: 1,
      min_size: 1,
      final_adj: false,
      packaging_id: [],
      packaging_vol: [],
      image_refs: ['prod_153-1.jpg'],
      nutrition_facts: [],
      ingredient_labels: [],
      add_ons: [],
      buy_by_packaging: false,
      fbw: false,
      ingredients: [''],
      is_ecomm: false,
      vendor_id: '5e5bd2c44e54321590714d1a',
      vendor_upc: '',
      tags: ['organic', 'non gmo', 'regionally sourced'],
      lifestyles: ['Dairy-Free', 'Gluten-Free', 'Peanut-Free'],
      values: ['Organic', 'Non-GMO', 'Regionally Sourced'],
      _id: '5f1898651797206b26b9232c',
      product_id: 'prod_153',
      product_num: 153,
      subcat_id: '254064',
      name: 'Upcycled Honey Roasted Almond Butter',
      description: '',
      unit_type: 'ea',
      vendor: 'NotMilk',
      manufacturer: 'NotMilk',
      bulk_price: 1600,
      shelf_life: 180,
      origin: 'Long Island City, NY, 11101',
      characteristic_id: '5dfa48bec3d5b10917b943af',
      createdAt: '2020-07-22T19:49:57.285Z',
      updatedAt: '2020-12-19T16:58:36.345Z',
      __v: 2,
      density: 0.06,
      instruction: '',
      inventory: [
        {
          live: true,
          seasonal_months: [],
          consecutive_miss: 0,
          _id: '5f1898651797206b26b9232d',
          product_id: 'prod_153',
          current_inventory: 0,
          packaging_type_id: '5dfa48b8c3d5b10917b9434b',
          packaging_type: '16 oz Wally Jar',
          upc_code: '810043101622',
          available_times: [],
          createdAt: '2020-07-22T19:49:57.332Z',
          updatedAt: '2021-01-13T13:45:44.242Z',
          __v: 0,
          price: 1584,
          unit_weight: 0.99,
          isAvailable: true,
          id: '5f1898651797206b26b9232d',
        },
      ],
      subcategory: {
        _id: '5dfa48bbc3d5b10917b94364',
        category_id: '254064',
        name: 'Nut Butters',
        id: '5dfa48bbc3d5b10917b94364',
      },
      vendorFull: {
        _id: '5e5bd2c44e54321590714d1a',
        name: 'NotMilk',
      },
      id: '5f1898651797206b26b9232c',
    },
  ],
  brands: ['NotMilk'],
  lifestyles: ['Gluten-Free', 'Peanut-Free', 'Dairy-Free'],
  subcategories: ['Almond Butters', 'Flours'],
  values: ['Organic', 'Non-GMO', 'Vegan', 'Regionally Sourced'],
};

const RESPONSE_RANDOMLY_ORDERED_FOR_PRICE = {
  ...RESPONSE,
  products: [
    {
      ...RESPONSE.products[0],
      _id: 1,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 300,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 2,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 100,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 3,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 200,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 4,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 50,
        },
      ],
    },
  ],
};

const RESPONSE_RANDOMLY_ORDERED_FOR_PRICE_SOLD_OUT = {
  ...RESPONSE,
  products: [
    {
      ...RESPONSE.products[0],
      _id: 1,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 300,
          isAvailable: false,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 2,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 100,
          isAvailable: true,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 3,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 200,
          isAvailable: false,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 4,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 50,
          isAvailable: true,
        },
      ],
    },
  ],
};

const RESPONSE_RANDOMLY_ORDERED_FOR_ALPHABET = {
  ...RESPONSE,
  products: [
    { ...RESPONSE.products[0], _id: 1, name: 'Dxyz' },
    { ...RESPONSE.products[0], _id: 2, name: 'Cxyz' },
    { ...RESPONSE.products[0], _id: 3, name: 'Axyz' },
    { ...RESPONSE.products[0], _id: 4, name: 'Bxyz' },
  ],
};

// Price Expectations
const RESPONSE_RANDOMLY_ORDERED_FOR_PRICE__EXPECTED_HIGH_TO_LOW = {
  ...RESPONSE,
  products: [
    {
      ...RESPONSE.products[0],
      _id: 1,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 300,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 3,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 200,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 2,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 100,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 4,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 50,
        },
      ],
    },
  ],
};

const RESPONSE_RANDOMLY_ORDERED_FOR_PRICE__EXPECTED_LOW_TO_HIGH = {
  ...RESPONSE,
  products: [
    {
      ...RESPONSE.products[0],
      _id: 4,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 50,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 2,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 100,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 3,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 200,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 1,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 300,
        },
      ],
    },
  ],
};

const RESPONSE_RANDOMLY_ORDERED_FOR_PRICE_SOLD_OUT__EXPECTED_HIGH_TO_LOW = {
  ...RESPONSE,
  products: [
    {
      ...RESPONSE.products[0],
      _id: 1,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 300,
          isAvailable: false,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 3,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 200,
          isAvailable: false,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 2,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 100,
          isAvailable: true,
        },
      ],
    },
    {
      ...RESPONSE.products[0],
      _id: 4,
      inventory: [
        {
          ...RESPONSE.products[0].inventory[0],
          price: 50,
          isAvailable: true,
        },
      ],
    },
  ],
};

// Alphabetical Expectations
const RESPONSE_RANDOMLY_ORDERED_FOR_ALPHABET__EXPECTED_A_TO_Z = {
  ...RESPONSE,
  products: [
    { ...RESPONSE.products[0], _id: 3, name: 'Axyz' },
    { ...RESPONSE.products[0], _id: 4, name: 'Bxyz' },
    { ...RESPONSE.products[0], _id: 2, name: 'Cxyz' },
    { ...RESPONSE.products[0], _id: 1, name: 'Dxyz' },
  ],
};

const RESPONSE_RANDOMLY_ORDERED_FOR_NEWNESS = {
  ...RESPONSE,
  products: [
    {
      ...RESPONSE.products[0],
      _id: 1,
      createdAt: '2020-11-05T15:15:48.098Z',
    },
    {
      ...RESPONSE.products[0],
      _id: 2,
      createdAt: '2020-11-30T16:55:05.143Z',
    },
    {
      ...RESPONSE.products[0],
      _id: 3,
      createdAt: '2020-10-21T17:40:12.237Z',
    },
    {
      ...RESPONSE.products[0],
      _id: 4,
      createdAt: '2020-10-21T17:40:11.499Z',
    },
  ],
};

const RESPONSE_RANDOMLY_ORDERED_FOR_NEWNESS__EXPECTED = {
  ...RESPONSE,
  products: [
    {
      ...RESPONSE.products[0],
      _id: 2,
      createdAt: '2020-11-30T16:55:05.143Z',
    },
    {
      ...RESPONSE.products[0],
      _id: 1,
      createdAt: '2020-11-05T15:15:48.098Z',
    },
    {
      ...RESPONSE.products[0],
      _id: 3,
      createdAt: '2020-10-21T17:40:12.237Z',
    },
    {
      ...RESPONSE.products[0],
      _id: 4,
      createdAt: '2020-10-21T17:40:11.499Z',
    },
  ],
};
