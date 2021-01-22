import React from 'react';
import PropTypes from 'prop-types';

// Material Design
import {
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  makeStyles,
  Typography,
} from '@material-ui/core';

// MobX
import { useStores } from 'hooks/mobx';
import { observer } from 'mobx-react';

const LIFESTYLE_FILTERS = [
  { title: 'Dairy-Free', value: 'allergen,dairy' },
  { title: 'Gluten-Free', value: 'allergen,gluten' },
  { title: 'Peanut-Free', value: 'allergen,peanuts' },
  { title: 'Tree Nut Free', value: 'allergen,tree nuts' },
];

const VALUE_FILTERS = [
  { title: 'Fair Trade', value: 'tag,fair trade' },
  {
    title: 'Made With 95% Organic Ingredients',
    value: 'tag,Made with 95% organic ingredients',
  },
  { title: 'Non-GMO', value: 'tag,non gmo' },
];

function Filters() {
  return (
    <>
      <Box mb={2}>
        <Typography component="p" gutterBottom variant="h5">
          Filter by lifestyle:
        </Typography>
        <FormGroup row>
          {LIFESTYLE_FILTERS.map((f) => (
            <Filter filter={f} key={f.title} />
          ))}
        </FormGroup>
      </Box>
      <Box>
        <Typography component="p" gutterBottom variant="h5">
          Filter by values:
        </Typography>
        <FormGroup row>
          {VALUE_FILTERS.map((f) => (
            <Filter filter={f} key={f.title} />
          ))}
        </FormGroup>
      </Box>
    </>
  );
}

export default Filters;

const useStyles = makeStyles(() => ({
  root: {
    width: '100%', // to make label clickable for the entire width
    display: 'flex',
    margin: 0,
  },
  label: {
    width: '100%',
  },
}));

const Filter = observer(({ filter }) => {
  // State
  const { product: productStore } = useStores();
  const { filters } = productStore;
  const { title, value } = filter;
  const isChecked = filters.includes(value);

  // Styles
  const classes = useStyles();

  const handleOnFilterSelect = (value) => {
    const valueIndex = filters.indexOf(value);

    if (valueIndex === -1) {
      productStore.addFilter(value);
    } else {
      productStore.removeFilter(valueIndex);
    }
  };
  return (
    <FormControlLabel
      classes={{ root: classes.root, label: classes.label }}
      control={<Checkbox color="primary" checked={isChecked} name={title} />}
      onChange={() => handleOnFilterSelect(value)}
      label={title}
    />
  );
});

Filter.propTypes = {
  filter: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }),
};
