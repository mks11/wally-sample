import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
  // Matches bootstrap since app has already been using bootstrap
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
  palette: {
    primary: {
      main: '#97adff',
    },
    secondary: {
      main: '#42E2B8',
    },
  },
  typography: {
    h1: {
      fontFamily: ['ClearFace'].join(','),
      fontSize: '2.25rem',
      fontWeight: 'bold',
    },
    h2: {
      fontFamily: ['Sofia Pro'].join(','),
      fontSize: '1.8rem',
      fontWeight: 'bold',
    },
    h3: {
      fontFamily: ['Sofia Pro'].join(','),
      fontSize: '1.6rem',
      fontWeight: 'bold',
    },
    h4: {
      fontFamily: ['Sofia Pro'].join(','),
      fontSize: '1.4rem',
      fontWeight: 'bold',
    },
    h5: {
      fontFamily: ['Sofia Pro'].join(','),
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    h6: {
      fontFamily: ['Sofia Pro'].join(','),
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    subtitle1: {
      fontFamily: ['Sofia Pro'].join(','),
      fontSize: '0.85rem',
      color: '#6B6D76',
    },
    subtitle2: {
      fontFamily: ['Sofia Pro'].join(','),
      fontSize: '1rem',
      color: '#6B6D76',
    },
    body1: {
      fontFamily: ['Sofia Pro'].join(','),
      fontSize: '1.25rem',
    },
    body2: {
      fontFamily: ['Sofia Pro'].join(','),
      fontSize: '1rem',
    },
    button: {},
    caption: {},
    overline: {},
  },
  overrides: {
    MuiTypography: {
      gutterBottom: {
        marginBottom: '0.75em',
      },
    },
    MuiButton: {
      label: {
        textTransform: 'capitalize',
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
