import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import Product from '../Product';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

function ProductList({ display, mode, deliveryTimes }) {
  const { product: productStore } = useStores();
  const { filters } = productStore;

  useEffect(() => {
    const $ = window.$;

    const speed = window.innerWidth <= 500 ? '40' : '25';

    $('.big-arrow.left-arrow').click(function () {
      $(this)
        .siblings('.container-fluid')
        .animate(
          {
            scrollLeft: `+=${speed}`,
          },
          50,
          'linear',
        );
    });

    $('.big-arrow.right-arrow').click(function () {
      $(this)
        .siblings('.container-fluid')
        .animate(
          {
            scrollLeft: `-=${speed}`,
          },
          50,
          'linear',
        );
    });
  }, []);

  return (
    <div className="product">
      <h2>{display.cat_name}</h2>
      <div className="product-sub">
        <h5>{display.cat_name}</h5>
        <Link to={`/main/${display.cat_id}`}>
          View All {display.number_products}
        </Link>
      </div>

      {mode === 'limit' && <Button className="big-arrow right-arrow" />}
      <div className="container-fluid">
        <div
          className={`row flex-row ${mode === 'limit' ? 'flex-nowrap' : ''}`}
        >
          {display.products
            .filter((p) =>
              filters.length
                ? !filters.some((f) => {
                    if (p.allergens && p.tags) {
                      let [t, v] = f.split(',');
                      if (t === 'allergen') return p.allergens.includes(v);
                      if (t === 'tag') return !p.tags.includes(v);
                    }
                    return true;
                  })
                : true,
            )
            .map((product, index) => (
              <Product
                key={index}
                product={product}
                deliveryTimes={deliveryTimes}
              />
            ))}
        </div>
      </div>
      {mode === 'limit' && <Button className="big-arrow left-arrow" />}
    </div>
  );
}

export default observer(ProductList);
