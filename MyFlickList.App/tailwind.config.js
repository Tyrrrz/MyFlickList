module.exports = {
  purge: [
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      width: {
        'fit-content': 'fit-content'
      },
      minWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%'
      }
    }
  },
  variants: {
    backgroundColor: ['hover', 'focus', 'disabled'],
    borderColor: ['hover', 'focus', 'disabled'],
    textColor: ['hover', 'focus', 'disabled'],
    cursor: ['hover', 'focus', 'disabled']
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  }
};
