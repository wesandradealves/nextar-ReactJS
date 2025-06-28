import React from 'react';
import { ThemeProvider } from 'styled-components';
import { LoaderProvider } from '../src/context/spinner';

// Tema para o Storybook
const theme = {
  _breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
};

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
        {
          name: 'antarctic',
          value: '#f0f8ff',
        },
      ],
    },
  },
  decorators: [
    (Story) => React.createElement(
      ThemeProvider,
      { theme },
      React.createElement(
        LoaderProvider,
        {},
        React.createElement(
          'div',
          { style: { padding: '1rem' } },
          React.createElement(Story)
        )
      )
    ),
  ],
};

export default preview;
