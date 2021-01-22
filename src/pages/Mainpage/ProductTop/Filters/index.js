import React from 'react';
import PropTypes from 'prop-types';

// Material UI
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

const FILTERS = [
  { title: 'Biodegradable', value: 'tag,Biodegradable' },
  { title: 'BIPOC-Led', value: 'tag,BIPOC-Led' },
  { title: 'Dairy-Free', value: 'allergen,dairy' },
  { title: 'Gluten-Free', value: 'allergen,gluten' },
  {
    title: 'Made With at least 95% Organic Ingredients',
    value: 'tag,Made with at least 95% organic ingredients',
  },
  { title: 'Non-GMO', value: 'tag,non gmo' },
  { title: 'Vegan', value: 'tag,vegan' },
  { title: 'Women-Led', value: 'tag,Woman-Led' },
];

function Filters() {
  return (
    <Box mb={2}>
      <Typography component="p" variant="h5">
        Shop by lifestyles & values
      </Typography>
      <FormGroup row>
        {FILTERS.map((f) => (
          <Filter filter={f} key={f.title} />
        ))}
      </FormGroup>
    </Box>
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
    fontSize: '15px',
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
      control={
        <Checkbox
          color="primary"
          checked={isChecked}
          name={title}
          style={{ padding: '6px' }}
        />
      }
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
