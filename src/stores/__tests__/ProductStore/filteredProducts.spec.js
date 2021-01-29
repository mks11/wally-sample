import { applyFilters } from './../../ProductStore';

const AN_UNLIKELY_STRING = 'aXYx';

describe('Products should be able to correctly filter by user preferences', () => {
  it('# should show ALL products when no filters provided', () => {
    const result = applyFilters(RESPONSE.products, {
      selectedBrands: [],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [],
    });

    expect(result).toEqual(RESPONSE.products);
    const count = result.length;
    expect(count).toBe(RESPONSE.products.length);
  });

  it('# should match zero when no products are returned', () => {
    const result = applyFilters(RESPONSE_NO_MATCH.products, {
      selectedBrands: [AN_UNLIKELY_STRING],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [],
    });
    expect(result).toEqual(RESPONSE_NO_MATCH.products);
    const count = result.length;
    expect(count).toBe(0);
  });

  it('# should show zero match when a random text is provided in selectedBrands', () => {
    const result = applyFilters(RESPONSE.products, {
      selectedBrands: [AN_UNLIKELY_STRING],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(0);
  });

  it('# should show zero match when a random text is provided in selectedLifestyles', () => {
    const result = applyFilters(RESPONSE.products, {
      selectedBrands: [],
      selectedLifestyles: [AN_UNLIKELY_STRING],
      selectedValues: [],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(0);
  });

  it('# should show zero match when a random text is provided in selectedValues', () => {
    const result = applyFilters(RESPONSE.products, {
      selectedBrands: [],
      selectedLifestyles: [],
      selectedValues: [AN_UNLIKELY_STRING],
      selectedSubcategories: [],
    });
    const count = result.length;
    expect(count).toBe(0);
  });

  it('# should show zero match when a random text is provided in selectedSubcategories', () => {
    const result = applyFilters(RESPONSE.products, {
      selectedBrands: [],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [AN_UNLIKELY_STRING],
    });
    const count = result.length;
    expect(count).toBe(0);
  });

  it("should correctly filter out products that don't match the selected brands", () => {
    const result = applyFilters(RESPONSE_WITH_MULTIPLE_BRANDS.products, {
      selectedBrands: ['Brand A', 'Brand B', 'Brand C'],
      selectedLifestyles: [],
      selectedValues: [],
      selectedSubcategories: [],
    });

    const EXPECTED_RESULT = RESPONSE_WITH_MULTIPLE_BRANDS.products.slice(3);
    expect(result).toEqual(EXPECTED_RESULT);
    const count = result.length;
    expect(count).toBe(4);
  });

  it("should correctly filter out products that don't match all of the selected lifestyles", () => {
    const result = applyFilters(
      RESPONSE_MULTIPLE_MATCHING_LIFESTYLES.products,
      {
        selectedBrands: [],
        selectedLifestyles: ['Lifestyle A', 'Lifestyle B', 'Lifestyle C'],
        selectedValues: [],
        selectedSubcategories: [],
      },
    );

    const EXPECTED_RESULT = RESPONSE_MULTIPLE_MATCHING_LIFESTYLES.products.slice(
      -1,
    );
    expect(result).toEqual(EXPECTED_RESULT);
    const count = result.length;
    expect(count).toBe(1);
  });

  it("should correctly filter out products with subcategories that aren't selected", () => {
    const result = applyFilters(
      RESPONSE_MULTIPLE_MATCHING_SUBCATEGORIES.products,
      {
        selectedBrands: [],
        selectedLifestyles: [],
        selectedValues: [],
        selectedSubcategories: [
          'Subcategory A',
          'Subcategory B',
          'Subcategory C',
        ],
      },
    );

    const EXPECTED_RESULT = RESPONSE_MULTIPLE_MATCHING_SUBCATEGORIES.products.slice(
      3,
    );
    expect(result).toEqual(EXPECTED_RESULT);
    const count = result.length;
    expect(count).toBe(3);
  });

  it("should correctly filter out products that don't match all selected values", () => {
    const result = applyFilters(RESPONSE_MULTIPLE_MATCHING_VALUES.products, {
      selectedBrands: [],
      selectedLifestyles: [],
      selectedValues: ['Value A', 'Value B', 'Value C'],
      selectedSubcategories: [],
    });

    const EXPECTED_RESULT = RESPONSE_MULTIPLE_MATCHING_VALUES.products.slice(
      -1,
    );
    expect(result).toEqual(EXPECTED_RESULT);
    const count = result.length;
    expect(count).toBe(1);
  });

  it("should correctly filter out products that don't match all of the selected filtration options", () => {
    const result = applyFilters(RESPONSE_ALL_FILTER_OPTIONS_SELECTED.products, {
      selectedBrands: ['Brand B'],
      selectedLifestyles: ['Lifestyle A', 'Lifestyle B'],
      selectedValues: ['Value A', 'Value B'],
      selectedSubcategories: ['Subcategory A'],
    });

    const EXPECTED_RESULT = RESPONSE_ALL_FILTER_OPTIONS_SELECTED.products.slice(
      -1,
    );
    expect(result).toEqual(EXPECTED_RESULT);
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
  products: [],
  brands: [],
  lifestyles: [],
  subcategories: [],
  values: [],
};

const RESPONSE_WITH_MULTIPLE_BRANDS = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    {
      ...RESPONSE.products[0],
      vendorFull: {
        name: 'Brand A',
      },
    },
    {
      ...RESPONSE.products[0],
      vendorFull: {
        name: 'Brand B',
      },
    },
    {
      ...RESPONSE.products[0],
      vendorFull: {
        name: 'Brand C',
      },
    },
    {
      ...RESPONSE.products[0],
      vendorFull: {
        name: 'Brand A',
      },
    },
  ],
};

const RESPONSE_MULTIPLE_MATCHING_LIFESTYLES = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    { ...RESPONSE.products[0], lifestyles: ['Lifestyle A', 'Lifestyle B'] },
    { ...RESPONSE.products[0], lifestyles: ['Lifestyle A', 'Lifestyle C'] },
    {
      ...RESPONSE.products[0],
      lifestyles: ['Lifestyle A', 'Lifestyle B', 'Lifestyle C', 'Lifestyle D'],
    },
  ],
};

const RESPONSE_MULTIPLE_MATCHING_SUBCATEGORIES = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    {
      ...RESPONSE.products[0],
      subcategory: {
        name: 'Subcategory A',
      },
    },
    {
      ...RESPONSE.products[0],
      subcategory: {
        name: 'Subcategory B',
      },
    },
    {
      ...RESPONSE.products[0],
      subcategory: {
        name: 'Subcategory C',
      },
    },
  ],
};

const RESPONSE_MULTIPLE_MATCHING_VALUES = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    { ...RESPONSE.products[0], values: ['Value A', 'Value B'] },
    { ...RESPONSE.products[0], values: ['Value A', 'Value C'] },
    {
      ...RESPONSE.products[0],
      values: ['Value A', 'Value B', 'Value C', 'Value D'],
    },
  ],
};

// CONDITIONS:
// 'Lifestyle A', 'Lifestyle B', 'Subcategory A', 'Brand B', 'Value A', 'Value B'
const RESPONSE_ALL_FILTER_OPTIONS_SELECTED = {
  ...RESPONSE,
  products: [
    ...RESPONSE.products,
    // Only has correct brand
    {
      ...RESPONSE.products[0],
      vendorFull: {
        name: 'Brand B',
      },
      lifestyles: ['Lifestyle B', 'Lifestyle C'],
      subcategory: { name: 'Subcategory B' },
      values: ['Value B', 'Value C'],
    },
    // Only has correct lifestyles
    {
      ...RESPONSE.products[0],
      vendorFull: {
        name: 'Brand A',
      },
      lifestyles: ['Lifestyle A', 'Lifestyle B'],
      subcategory: { name: 'Subcategory B' },
      values: ['Value C'],
    },
    // Only has correct subcategory
    {
      ...RESPONSE.products[0],
      vendorFull: {
        name: 'Brand A',
      },
      lifestyles: ['Lifestyle B', 'Lifestyle C'],
      subcategory: { name: 'Subcategory A' },
      values: ['Value C'],
    },
    // Only has correct values
    {
      ...RESPONSE.products[0],
      vendorFull: {
        name: 'Brand A',
      },
      lifestyles: ['Lifestyle B', 'Lifestyle C'],
      subcategory: { name: 'Subcategory C' },
      values: ['Value A', 'Value B', 'Value C'],
    },
    // brand name, lifestyles, subcategory, and values all match the conditions
    {
      ...RESPONSE.products[0],
      vendorFull: {
        name: 'Brand B',
      },
      lifestyles: ['Lifestyle A', 'Lifestyle B', 'Lifestyle C'],
      subcategory: { name: 'Subcategory A' },
      values: ['Value A', 'Value B', 'Value C'],
    },
  ],
};
