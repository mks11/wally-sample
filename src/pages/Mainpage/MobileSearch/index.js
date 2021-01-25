import React from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import Filters from '../ProductTop/Filters';

// Material UI
import { Box, Typography } from '@material-ui/core';

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
      <Typography gutterBottom variant="h1">
        Filter
      </Typography>
      <Box mb={2}>
        <Filters />
      </Box>
      <Typography component="p" gutterBottom variant="h5">
        Shop by category:
      </Typography>
      <ul className="category-mobile-wrap">
        {productStore.sidebar.map((s, i) => {
          const isSelectedCategory = categoryId === s.category_id;
          const selectedCategory = isSelectedCategory ? 'text-violet' : '';
          const link = `/main/${s.category_id}`;

          return (
            <li key={i}>
              <div>
                <Link to={link} onClick={handleCategoryClick} replace>
                  <Typography className={selectedCategory}>{s.name}</Typography>
                </Link>
              </div>
              <ul>
                {s.categories &&
                  s.categories.map((sc, idx) => {
                    const isSelectedSubcategory = categoryId === sc.category_id;
                    const selectedSubcategory = isSelectedSubcategory
                      ? 'text-violet'
                      : '';
                    return (
                      <li key={idx}>
                        <Link
                          to={`/main/${sc.category_id || ''}`}
                          onClick={handleCategoryClick}
                        >
                          <Typography
                            className={selectedCategory || selectedSubcategory}
                          >
                            {sc.name}
                          </Typography>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default observer(MobileSearch);
