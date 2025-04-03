import { createTheme } from '@aws-amplify/ui-react';

export const darkTheme = createTheme({
  name: 'dark-theme',
  tokens: {
    colors: {
      primary: {
        10: '#F28E32',
        40: '#F28E32',
        60: '#F28E32',
        80: '#231F20',
        100: '#231F20'
      },
      background: {
        primary: '#231F20',
        secondary: '#1A1A1A'
      },
      font: {
        primary: '#FFFFFF',
        secondary: '#F28E32'
      }
    }
  }
});

export const lightTheme = createTheme({
  name: 'light-theme',
  tokens: {
    colors: {
      primary: {
        10: '#F28E32',
        40: '#F28E32',
        60: '#F28E32',
        80: '#FFFFFF',
        100: '#FFFFFF'
      },
      background: {
        primary: '#FFFFFF',
        secondary: '#FAFAFA'
      },
      font: {
        primary: '#231F20',
        secondary: '#F28E32'
      }
    }
  }
});