/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/** @type {import('tailwindcss').Config} */

const plugins = [require('daisyui')]

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './.storybook/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Poppins-Regular'],
      italic: ['Poppins-Italic'],
      mediumItalic: ['Poppins-MediumItalic'],
      semiBold: ['Poppins-SemiBold'],
      bold: ['Poppins-Bold'],
      medium: ['Poppins-Medium'],
      extraBold: ['Poppins-ExtraBold'],
    },
    // fontFamily: {
    //   Roboto: ['Roboto', 'sans-serif'],
    //   base: ['Segoe UI', 'Proxima Nova', 'SF Pro', 'PT Sans', 'sans-serif'],
    // },
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.1s ease-in-out infinite',
      },
      colors: {
        brandPrimary: {
          50: '#f1f3fd',
          100: '#dee3fb',
          200: '#c5cff8',
          300: '#9db1f3',
          400: '#6f88eb',
          500: '#4d61e4',
          600: '#3842d8',
          700: '#2f32c6',
          800: '#2d2ca1',
          900: '#292a7f',
          950: '#222159',
        },
        brandSecondary: {
          50: '#fffaeb',
          100: '#fff2c6',
          200: '#ffe288',
          300: '#ffc93a',
          400: '#ffb820',
          500: '#f99507',
          600: '#dd6e02',
          700: '#b74c06',
          800: '#943a0c',
          900: '#7a310d',
          950: '#461702',
        },
      },
      fontSize: {
        copy: 'inherit',
      },
    },
  },
  plugins,
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          primary: '#222159',
          secondary: '#ffc93a',
          accent: '#273a83',
          success: '#bdea74',
        },
      },
      {
        dark: {
          ...require('daisyui/src/colors/themes')['[data-theme=dark]'],
          primary: '#222159',
          secondary: '#ffc93a',
          accent: '#4472c4',
          success: '#bdea74',
        },
      },
    ],
  },
}
