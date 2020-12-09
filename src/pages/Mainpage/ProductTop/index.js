import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'reactstrap';

// MobX
import { observer } from 'mobx-react';
import { useStores } from 'hooks/mobx';

import Filters from './Filters';
import SearchBar from './SearchBar';

import reorder from 'images/reorder.png';

const MobileSearch = lazy(() => import('pages/Mainpage/MobileSearch'));

function ProductTop({ onSearch }) {
  const { modalV2 } = useStores();

  const handleMobileSearch = (e) => {
    if (e.keyCode === 13) {
      onSearch && onSearch(e.target.value);
    }
  };

  const openMobileSearch = () => {
    modalV2.open(
      <Suspense fallback={<p>Loading...</p>}>
        <MobileSearch onSearch={handleMobileSearch} />
      </Suspense>,
    );
  };

  return (
    <div className="product-top">
      <Container>
        <Row>
          <Col className="d-none d-lg-block col-4">
            <Filters />
          </Col>
          <Col>
            <div className="d-flex align-items-start">
              <SearchBar />
              <Col xs="auto" className="d-block d-lg-none ml-auto">
                <button
                  className="btn btn-transparent"
                  onClick={openMobileSearch}
                >
                  <span className="catsearch-icon"></span>
                </button>
              </Col>
              <Link className="d-none d-md-block ml-3" to="/main/buyagain">
                <img src={reorder} height="40" alt="" />
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default observer(ProductTop);
