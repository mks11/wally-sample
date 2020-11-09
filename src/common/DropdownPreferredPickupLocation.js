import React, { useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import PropTypes from 'prop-types';

export default function PreferredPickup({
  defaultLocation,
  disable,
  selected,
  handleSelected,
}) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const hideDropdown = () => setDropdownOpen(false);

  // if not disabled, toggle
  const toggleDropdown = () => !disable && setDropdownOpen(!isDropdownOpen);

  const pickupLocations = [
    'Front Door',
    'Back Door',
    'Shipping',
    'Receiving',
    'Office',
    'Mail Room',
    'Garage',
    'Upstairs',
    'Downstairs',
    'Guard House',
    'Third party',
    'Warehouse',
    'None',
  ].filter((p) => p !== defaultLocation);

  let dropdownClass = 'dropdown-menu';
  if (isDropdownOpen) {
    dropdownClass += ' show';
  }
  let dropdownButtonClass = 'btn btn-dropdown-outline dropdown-toggle';
  if (disable) {
    dropdownButtonClass += ' disabled';
  }

  const handleSelectedLocal = (item) => {
    handleSelected(item);
    //close the dropdown
    setDropdownOpen(false);
  };

  return (
    <div className="dropdown show">
      <ClickAwayListener onClickAway={hideDropdown}>
        <>
          <button
            onClick={toggleDropdown}
            className={dropdownButtonClass}
            type="button"
            data-toggle="dropdown"
            aria-expanded="true"
          >
            {selected ? (
              <React.Fragment>{selected}</React.Fragment>
            ) : (
              <React.Fragment>Preferred Pickup Location</React.Fragment>
            )}
          </button>
          <div className={dropdownClass}>
            {pickupLocations.map((item, key) => {
              return (
                <React.Fragment key={key}>
                  <div
                    className="dropdown-item"
                    onClick={() => handleSelectedLocal(item)}
                  >
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        name="timeRadio"
                        className="custom-control-input"
                        checked={selected === item}
                      />
                      <label className="custom-control-label">{item}</label>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </>
      </ClickAwayListener>
    </div>
  );
}

PreferredPickup.defaultProps = {
  disable: false,
};

PreferredPickup.propTypes = {
  handleSelected: PropTypes.func.isRequired,
  defaultLocation: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired,
  disable: PropTypes.bool,
};
