// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 9545,
      network_id: '*' // Match any network id
    }
  }
}
