var TradesContract = artifacts.require("./Trades.sol");

module.exports = function (deployer) {
  deployer.deploy(TradesContract)
}
