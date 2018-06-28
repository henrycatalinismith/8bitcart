const { environment } = require('@rails/webpacker')

environment.loaders.append('pegjs', {
  test: /\.(pegjs|raw\.js)/,
  use: 'raw-loader'
});

module.exports = environment
