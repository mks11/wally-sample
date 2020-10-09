import React from 'react';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

// Services & Utilities
import { logEvent, logModalView } from 'services/google-analytics';
import { formatMoney } from 'utils';

// Custom Components
import CarbonBar from 'common/CarbonBar';
import CheckoutButton from './CheckoutButton';

function CartDropdown() {
  const { checkout, modal, product, routing, ui, user } = useStores();
  const { cart } = checkout;

  const handleMouseEnter = () => {
    ui.showBackdrop();
    logModalView('/cart');
  };

  const handleMouseLeave = () => {
    ui.hideBackdrop();
    logEvent({ category: 'Cart', action: 'CloseCart' });
  };

  const handleMouseEnterWithoutLog = () => {
    ui.showBackdrop();
  };

  const handleMouseLeaveWithoutLog = () => {
    ui.hideBackdrop();
  };

  const handleCheckout = () => {
    logEvent({ category: 'Cart', action: 'ClickCheckout' });
    ui.hideBackdrop();
    if (user.status) {
      routing.push('/main/similar-products');
    } else {
      modal.toggleModal('login');
    }
  };

  const handleEdit = (data) => {
    logEvent({ category: 'Cart', action: 'ClickEditProduct' });
    product
      .showModal(
        data.product_id,
        data.customer_quantity,
        user.getDeliveryParams(),
      )
      .then((data) => {
        user.adjustDeliveryTimes(data.delivery_date, checkout.deliveryTimes);
        modal.toggleModal('product');
      });
  };

  const handleDelete = (id) => {
    logEvent({ category: 'Cart', action: 'ClickDeleteProduct' });
    modal.toggleModal('delete', id);
  };

  const getItemsCount = (items) => {
    let count = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      count += items[i].customer_quantity;
    }
    return count;
  };
  const items = cart ? cart.cart_items : [];
  const count = getItemsCount(items);
  const subtotal = cart ? cart.subtotal / 100 : 0;

  return (
    <div className="dropdown-cart-wrapper">
      <div className="btn-group dropdown-cart">
        <div className="product-cart-counter">
          <CheckoutButton
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onCheckout={handleCheckout}
            count={count}
          />
        </div>
        <div
          className="dropdown-wrapper"
          onMouseEnter={handleMouseEnterWithoutLog}
          onMouseLeave={handleMouseLeaveWithoutLog}
        >
          <div className="dropdown-menu dropdown-menu-right">
            <div className="px-3">
              <CarbonBar nCartItems={count} />
            </div>
            {items && count > 0 ? (
              <>
                <h3 className="px-3">Cart</h3>
                <div className="order-summary">
                  <div className="order-scroll px-3">
                    {items.map((c, i) => {
                      const unit_type = c.unit_type || c.price_unit;
                      const showType =
                        unit_type === 'packaging'
                          ? c.packaging_name
                          : unit_type;
                      return (
                        <div className="item mt-3 pb-2" key={i}>
                          <div className="item-left">
                            <h4 className="item-name">{c.product_name}</h4>
                            {unit_type !== 'packaging' && (
                              <span className="item-detail mb-1">
                                {c.packaging_name}
                              </span>
                            )}
                            <div className="item-link">
                              <a
                                className="text-blue mr-2"
                                onClick={() =>
                                  handleEdit({
                                    product_id: c.product_id,
                                    customer_quantity: c.customer_quantity,
                                  })
                                }
                              >
                                EDIT
                              </a>
                              <a
                                className="text-dark-grey"
                                onClick={() =>
                                  handleDelete({
                                    product_id: c.product_id,
                                    inventory_id: c._id,
                                  })
                                }
                              >
                                DELETE
                              </a>
                            </div>
                          </div>
                          <div className="item-right">
                            <h4>
                              x{c.customer_quantity} {showType}
                            </h4>
                            <span className="item-price">
                              {formatMoney(c.total / 100)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="item-total px-3">
                    <span>Total</span>
                    <span>{formatMoney(subtotal)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn mx-3 w-90 btn-main active"
                >
                  CHECKOUT
                </button>
              </>
            ) : (
              <span className="px-3">No items in cart</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(CartDropdown);
