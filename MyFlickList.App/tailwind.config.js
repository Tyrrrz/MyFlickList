module.exports = {
  purge: [
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.ts',
    './src/**/*.tsx',
    './public/**/*.html'
  ],
  theme: {
    extend: {}
  },
  variants: {
    opacity: ['responsive', 'hover', 'focus', 'group-hover']
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true
  }
};
