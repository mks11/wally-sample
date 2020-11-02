import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AddressCreateForm from 'forms/Address/Create';
import { PrimaryWallyButton } from 'styled-component-lib/Buttons';
import { Box, Button, Card, Typography, Collapse } from '@material-ui/core';
import AddressList from './AddressList';
import { Add } from '@material-ui/icons';
import { useStores } from 'hooks/mobx';

function AddressOptions(props) {
  const [selected, setSelected] = useState(props.selected);
  const [lock, setLock] = useState(props.lock);
  const [data, setData] = useState([]);

  const { modalV2 } = useStores();

  //todo/revisit the resulting effect can be achieved in handleSubmit callback with local states
  useEffect(() => {
    setSelected(selected || props.selected);
    setLock(lock || props.lock);
  }, [props.selected, props.lock]);

  useEffect(() => {
    if (!selected) {
      setSelected(props.user.preferred_address);
    }

    const getAddresses = () => {
      const data = props.user ? props.user.addresses : [];

      if (lock) {
        return data.filter((_d) => _d.address_id === selected);
      } else {
        return data;
      }
    };

    setData(getAddresses());
  }, [props.selected, selected, lock]);

  const handleSelectAddress = (address_id) => {
    setSelected(address_id);
    const address = props.user.addresses.find((d) => d._id === address_id);
    props.onSelect && props.onSelect(address);
  };

  const handleSubmitAddress = () => {
    if (!selected) return;
    if (props.locking) {
      setLock(true);
    } else {
      setLock(false);
    }
    const address = props.user.addresses.find((d) => d._id === selected);
    props.onSubmit &&
      props.onSubmit(address).catch((e) => {
        if (e.response && e.response.data.error) {
          // this.setState({
          //   invalidSelectAddress: e.response.data.error.message,
          // });
          //TODO appropriate replacement of the commented out?
        }
        console.error(e);
      });
  };

  const handleAddAddress = () => {
    modalV2.open(<AddressCreateForm />);
  };

  const unlock = () => {
    setLock(false);
    props.onUnlock && props.onUnlock();
  };

  const preferred_address = props.user ? props.user.preferred_address : null;

  const showButton = typeof props.button !== 'undefined' ? props.button : true;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>
          Shipping Address
        </Typography>
        {lock ? (
          <Button onClick={unlock}>
            <Typography variant="h6">Edit</Typography>
          </Button>
        ) : null}
      </Box>
      <Box mb={4}>
        <Card>
          <Box p={2}>
            <Box mb={2}>
              <PrimaryWallyButton
                onClick={handleAddAddress}
                style={{ width: '100%' }}
              >
                <Add /> Add New Address
              </PrimaryWallyButton>
            </Box>
            <Collapse in={!lock} collapsedHeight={80}>
              <AddressList
                data={data}
                selected={selected}
                preferred_address={preferred_address}
                onChange={handleSelectAddress}
              />
            </Collapse>
            {showButton && !lock ? (
              <PrimaryWallyButton
                className="btn btn-main active"
                onClick={handleSubmitAddress}
              >
                SUBMIT
              </PrimaryWallyButton>
            ) : null}
          </Box>
        </Card>
      </Box>
    </>
  );
}

AddressOptions.propTypes = {
  user: PropTypes.shape({
    preferred_address: PropTypes.string.isRequired,
    addresses: PropTypes.arrayOf(PropTypes.any),
    name: PropTypes.string,
    primary_telephone: PropTypes.string,
  }),
  onUnlock: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  selected: PropTypes.string,
  lock: PropTypes.bool,
  button: PropTypes.string,
};

export default AddressOptions;
