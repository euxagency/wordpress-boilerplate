// postcss.config.js
module.exports = {
  plugins: [
    require('postcss-prefix-selector')({
      prefix: '.plugin-name-app',  
    }),
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}