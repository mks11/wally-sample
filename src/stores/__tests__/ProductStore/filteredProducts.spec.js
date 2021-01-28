import { applyFilters } from './../../ProductStore';

const AN_UNLIKELY_STRING = 'aXYx';

describe('Products should be able to correctly filter by user preferences', () => {
  test('# should show ALL products when no filters provided', () => {
    const result = applyFilters(RESPONSE.products, {
      selectedBrands: [],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(RESPONSE.products.length);
  });

  test('# should match zero when no products are returned', () => {
    const result = applyFilters(RESPONSE_NO_MATCH.products, {
      selectedBrands: [AN_UNLIKELY_STRING],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(0);
  });

  test('# should show zero match when a random text is provided in selectedBrands', () => {
    const result = applyFilters(RESPONSE.products, {
      selectedBrands: [AN_UNLIKELY_STRING],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(0);
  });

  test('# should show zero match when a random text is provided in selectedLifestyles', () => {
    const result = applyFilters(RESPONSE.products, {
      selectedBrands: [],
      selectedLifestyles: [AN_UNLIKELY_STRING],
      selectedValues: [],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(0);
  });
  test('# should show zero match when a random text is provided in selectedValues', () => {
    const result = applyFilters(RESPONSE.products, {
      selectedBrands: [],
      selectedLifestyles: [],
      selectedValues: [AN_UNLIKELY_STRING],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(0);
  });
  test('# should show zero match when a random text is provided in selectedSubcategories', () => {
    const result = applyFilters(RESPONSE.products, {
      selectedBrands: [],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [AN_UNLIKELY_STRING],
    });
    const count = result.length;
    expect(count).toBe(0);
  });
  test('# should filter correctly for a matching Brand', () => {
    const result = applyFilters(RESPONSE.products, {
      selectedBrands: ['NotMilk'],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(RESPONSE.products.length);
  });
  test('# brand: should match exactly one', () => {
    const result = applyFilters(RESPONSE_BRANDS_MATCH_ONE.products, {
      selectedBrands: ['MATCH_ONE'],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(1);
  });
  test('# brands:  should match exactly two', () => {
    const result = applyFilters(RESPONSE_BRANDS_MATCH_TWO.products, {
      selectedBrands: ['MATCH_TWO'],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(2);
  });
  test('# lifestyles: should match exactly one', () => {
    const result = applyFilters(RESPONSE_LIFESTYLES_MATCH_ONE.products, {
      selectedBrands: [],
      selectedLifestyles: ['MATCH_ONE'],
      selectedValues: [],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(1);
  });
  test('# lifestyles:  should match exactly two', () => {
    const result = applyFilters(RESPONSE_LIFESTYLES_MATCH_TWO.products, {
      selectedBrands: [],
      selectedLifestyles: ['MATCH_TWO'],
      selectedValues: [],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(2);
  });
  test('# subcategories: should match exactly one', () => {
    const result = applyFilters(RESPONSE_SUBCATEGORIES_MATCH_ONE.products, {
      selectedBrands: [],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: ['MATCH_ONE'],
    });
    const count = result.length;
    expect(count).toBe(1);
  });
  test('# subcategories:  should match exactly two', () => {
    const result = applyFilters(RESPONSE_SUBCATEGORIES_MATCH_TWO.products, {
      selectedBrands: [],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: ['MATCH_TWO'],
    });
    const count = result.length;
    expect(count).toBe(2);
  });
  test('# values: should match exactly one', () => {
    const result = applyFilters(RESPONSE_VALUES_MATCH_ONE.products, {
      selectedBrands: [],
      selectedLifestyles: [],
      selectedValues: ['MATCH_ONE'],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(1);
  });
  test('# values: should match exactly two', () => {
    const result = applyFilters(RESPONSE_VALUES_MATCH_TWO.products, {
      selectedBrands: [],
      selectedLifestyles: [],
      selectedValues: ['MATCH_TWO'],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(2);
  });
  test('# intersection: values & brands  : should match exactly one', () => {
    const result = applyFilters(
      RESPONSE_INTERSECTION_VALUES_BRANDS_MATCH_ONE.products,
      {
        selectedBrands: [INTERSECTION_BRAND],
        selectedLifestyles: [],
        selectedValues: [INTERSECTION_VALUE],
        selectedSubcategories: [],
      },
    );
    const count = result.length;
    expect(count).toBe(1);
  });
  test('# intersection: values & lifestyle intersection : should match exactly one', () => {
    const result = applyFilters(
      RESPONSE_INTERSECTION_VALUES_LIFESTYLES_MATCH_ONE.products,
      {
        selectedBrands: [],
        selectedLifestyles: [INTERSECTION_LIFESTYLE],
        selectedValues: [INTERSECTION_VALUE],
        selectedSubcategories: [],
      },
    );
    const count = result.length;
    expect(count).toBe(1);
  });
  test('# intersection: values & subcategories  : should match exactly one', () => {
    const result = applyFilters(
      RESPONSE_INTERSECTION_VALUES_SUBCATEGORIES_MATCH_ONE.products,
      {
        selectedBrands: [],
        selectedLifestyles: [],
        selectedValues: [INTERSECTION_VALUE],
        selectedSubcategories: [INTERSECTION_SUBCATEGORY],
      },
    );
    const count = result.length;
    expect(count).toBe(1);
  });
  test('# intersection: brands & lifestyles  : should match exactly one', () => {
    const result = applyFilters(
      RESPONSE_INTERSECTION_BRANDS_LIFESTYLES_MATCH_ONE.products,
      {
        selectedBrands: [INTERSECTION_BRAND],
        selectedLifestyles: [INTERSECTION_LIFESTYLE],
        selectedValues: [],
        selectedSubcategories: [],
      },
    );
    const count = result.length;
    expect(count).toBe(1);
  });
  test('# intersection : brands & subcategories', () => {
    const result = applyFilters(
      RESPONSE_INTERSECTION_BRANDS_SUBCATEGORIES_MATCH_ONE.products,
      {
        selectedBrands: [INTERSECTION_BRAND],
        selectedLifestyles: [],
        selectedValues: [],
        selectedSubcategories: [INTERSECTION_SUBCATEGORY],
      },
    );
    const count = result.length;
    expect(count).toBe(1);
  });
  test('# intersection : lifestyles & subcategories', () => {
    const result = applyFilters(
      RESPONSE_INTERSECTION_LIFESTYLES_SUBCATEGORIES_MATCH_ONE.products,
      {
        selectedBrands: [],
        selectedLifestyles: [INTERSECTION_LIFESTYLE],
        selectedValues: [],
        selectedSubcategories: [INTERSECTION_SUBCATEGORY],
      },
    );
    const count = result.length;
    expect(count).toBe(1);
  });
  test('# intersection : values & lifestyles & subcategories & brand', () => {
    const result = applyFilters(RESPONSE_INTERSECTION_ALL_MATCH_ONE.products, {
      selectedBrands: [],
      selectedLifestyles: [INTERSECTION_LIFESTYLE],
      selectedValues: [],
      selectedSubcategories: [INTERSECTION_SUBCATEGORY],
    });
    const count = result.length;
    expect(count).toBe(1);
  });
});

// fixture
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

const RESPONSE_NO_MATCH = {
  ...RESPONSE,
  products: [],
};

const RESPONSE_BRANDS_MATCH_ONE = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    {
      ...RESPONSE.products[0],
      vendor: 'MATCH_ONE',
    },
  ],
};

const RESPONSE_BRANDS_MATCH_TWO = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    {
      ...RESPONSE.products[0],
      vendor: 'MATCH_TWO',
    },
    {
      ...RESPONSE.products[0],
      vendor: 'MATCH_TWO',
    },
  ],
};

const RESPONSE_LIFESTYLES_MATCH_ONE = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    { ...RESPONSE.products[0], lifestyles: ['MATCH_ONE', AN_UNLIKELY_STRING] },
  ],
};

const RESPONSE_LIFESTYLES_MATCH_TWO = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    { ...RESPONSE.products[0], lifestyles: ['MATCH_TWO', AN_UNLIKELY_STRING] },
    { ...RESPONSE.products[1], lifestyles: ['MATCH_TWO', AN_UNLIKELY_STRING] },
  ],
};

const RESPONSE_SUBCATEGORIES_MATCH_ONE = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    { ...RESPONSE.products[0], subcategory: ['MATCH_ONE', AN_UNLIKELY_STRING] },
  ],
};

const RESPONSE_SUBCATEGORIES_MATCH_TWO = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    { ...RESPONSE.products[0], subcategory: ['MATCH_TWO', AN_UNLIKELY_STRING] },
    { ...RESPONSE.products[1], subcategory: ['MATCH_TWO', AN_UNLIKELY_STRING] },
  ],
};

const RESPONSE_VALUES_MATCH_ONE = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    { ...RESPONSE.products[0], values: ['MATCH_ONE', AN_UNLIKELY_STRING] },
  ],
};

const RESPONSE_VALUES_MATCH_TWO = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    { ...RESPONSE.products[0], values: ['MATCH_TWO', AN_UNLIKELY_STRING] },
    { ...RESPONSE.products[1], values: ['MATCH_TWO', AN_UNLIKELY_STRING] },
  ],
};

/**************   intersection of values, brands and lifestyles ************/
const INTERSECTION_VALUE = 'INTERSECTION_VALUE';
const INTERSECTION_BRAND = 'INTERSECTION_BRAND';
const INTERSECTION_LIFESTYLE = 'INTERSECTION_LIFESTYLE';
const INTERSECTION_SUBCATEGORY = 'INTERSECTION_SUBCATEGORY';
const RESPONSE_INTERSECTION_VALUES_BRANDS_MATCH_ONE = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    {
      ...RESPONSE.products[0],
      values: [INTERSECTION_VALUE, AN_UNLIKELY_STRING],
      vendor: INTERSECTION_BRAND,
    },
    {
      ...RESPONSE.products[1],
      values: [INTERSECTION_VALUE, AN_UNLIKELY_STRING],
    },
    {
      ...RESPONSE.products[2],
      vendor: INTERSECTION_BRAND,
    },
  ],
};
const RESPONSE_INTERSECTION_VALUES_LIFESTYLES_MATCH_ONE = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    {
      ...RESPONSE.products[0],
      values: [INTERSECTION_VALUE, AN_UNLIKELY_STRING],
      lifestyles: [INTERSECTION_LIFESTYLE],
    },
    {
      ...RESPONSE.products[1],
      values: [INTERSECTION_VALUE, AN_UNLIKELY_STRING],
    },
    {
      ...RESPONSE.products[2],
      lifestyles: [INTERSECTION_LIFESTYLE, AN_UNLIKELY_STRING],
    },
  ],
};

const RESPONSE_INTERSECTION_VALUES_SUBCATEGORIES_MATCH_ONE = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    {
      ...RESPONSE.products[0],
      values: [INTERSECTION_VALUE, AN_UNLIKELY_STRING],
      subcategories: [INTERSECTION_SUBCATEGORY],
    },
    {
      ...RESPONSE.products[1],
      values: [INTERSECTION_VALUE, AN_UNLIKELY_STRING],
    },
    {
      ...RESPONSE.products[2],
      subcategories: [INTERSECTION_SUBCATEGORY, AN_UNLIKELY_STRING],
    },
  ],
};

const RESPONSE_INTERSECTION_BRANDS_LIFESTYLES_MATCH_ONE = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    {
      ...RESPONSE.products[0],
      vendor: INTERSECTION_BRAND,
      lifestyles: [INTERSECTION_LIFESTYLE],
    },
    {
      ...RESPONSE.products[1],
      values: [INTERSECTION_VALUE, AN_UNLIKELY_STRING],
    },
    {
      ...RESPONSE.products[2],
      lifestyles: [INTERSECTION_LIFESTYLE, AN_UNLIKELY_STRING],
    },
  ],
};

const RESPONSE_INTERSECTION_BRANDS_SUBCATEGORIES_MATCH_ONE = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    {
      ...RESPONSE.products[0],
      values: [INTERSECTION_VALUE, AN_UNLIKELY_STRING],
      lifestyles: [INTERSECTION_LIFESTYLE],
    },
    {
      ...RESPONSE.products[1],
      values: [INTERSECTION_VALUE, AN_UNLIKELY_STRING],
    },
    {
      ...RESPONSE.products[2],
      lifestyles: [INTERSECTION_LIFESTYLE, AN_UNLIKELY_STRING],
    },
  ],
};

const RESPONSE_INTERSECTION_LIFESTYLES_SUBCATEGORIES_MATCH_ONE = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    {
      ...RESPONSE.products[0],
      lifestyles: [INTERSECTION_LIFESTYLE],
      subcategories: [INTERSECTION_SUBCATEGORY, AN_UNLIKELY_STRING],
    },
    {
      ...RESPONSE.products[1],
      lifestyles: [INTERSECTION_LIFESTYLE, AN_UNLIKELY_STRING],
    },
    {
      ...RESPONSE.products[2],
      subcategories: [INTERSECTION_SUBCATEGORY, AN_UNLIKELY_STRING],
    },
  ],
};

const RESPONSE_INTERSECTION_ALL_MATCH_ONE = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    {
      ...RESPONSE.products[0],
      lifestyles: [INTERSECTION_LIFESTYLE, AN_UNLIKELY_STRING],
      subcategories: [INTERSECTION_SUBCATEGORY, AN_UNLIKELY_STRING],
      vendor: INTERSECTION_BRAND,
      values: [INTERSECTION_VALUE, AN_UNLIKELY_STRING],
    },
    {
      ...RESPONSE.products[1],
      lifestyles: [INTERSECTION_LIFESTYLE, AN_UNLIKELY_STRING],
    },
    {
      ...RESPONSE.products[2],
      vendor: INTERSECTION_BRAND,
    },
    {
      ...RESPONSE.products[2],
      subcategories: [INTERSECTION_SUBCATEGORY, AN_UNLIKELY_STRING],
    },
  ],
};
