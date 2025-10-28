import { GlobalStyles as MUIGlobalStyles } from '@mui/material';

const GlobalStyles = () => (
  <MUIGlobalStyles
    styles={{
      body: {
        margin: 0,
        padding: 0,
        backgroundColor: '#f5f5f5',
        fontFamily: "'Roboto', 'Arial', sans-serif",
        color: '#333',
      },
      a: {
        textDecoration: 'none',
        color: 'inherit',
      },
      '*': {
        boxSizing: 'border-box',
      },
    }}
  />
);
export default GlobalStyles;
