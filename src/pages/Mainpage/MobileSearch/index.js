import React from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import Filters from '../ProductTop/Filters';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

const MobileSearch = () => {
  const { modalV2, product: productStore, routing } = useStores();
  const categoryId = routing.location.pathname.replace('/main/', '');
  const handleCategoryClick = () => {
    modalV2.close();
    productStore.resetSearch();
  };

  return (
    <div>
      <div>
        <Filters column />
      </div>

      <ul className="category-mobile-wrap">
        {productStore.sidebar.map((s, i) => {
          const isSelectedCategory = categoryId === s.category_id;
          const parentSidebarClass = isSelectedCategory ? 'text-violet' : '';
          const link = `/main/${s.category_id}`;

          return (
            <li key={i}>
              <div>
                <Link
                  to={link}
                  className={parentSidebarClass}
                  onClick={handleCategoryClick}
                  replace
                >
                  {s.name}
                </Link>
              </div>
              <ul>
                {s.categories &&
                  s.categories.map((sc, idx) => (
                    <li key={idx}>
                      <Link
                        to={`/main/${sc.category_id || ''}`}
                        className={parentSidebarClass}
                        onClick={handleCategoryClick}
                      >
                        {sc.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default observer(MobileSearch);
