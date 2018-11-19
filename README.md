"# dapp" 

test command in cmd 

```
truffle compile
truffle networks --clean
truffle migrate --network ganache
truffle console --network ganache
truffle test -- 

Trades.deployed().then(function(contract) {contract.createTrade("testTitle","testDetail",{value: web3.toWei('10', 'ether'), from: web3.eth.accounts[5]}).then(function(result){console.log(result)})})

Trades.deployed().then(function(contract) {contract.acceptTrade(1,{from: web3.eth.accounts[6]})})

Trades.deployed().then(function(contract) {contract.finishTrade(1,"testInfo",{from: web3.eth.accounts[6]})})

Trades.deployed().then(function(contract) {contract.comfirmTrade(1,"comfirmInfo",{from: web3.eth.accounts[5]})})

Trades.deployed().then(function(contract) {contract.showCount({from: web3.eth.accounts[1]})}).toLocaleString()

```