// components/theme.ts
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { ReactNode } from 'react';

export const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#C3B8F9',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

interface ThemeProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<ThemeProps> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
