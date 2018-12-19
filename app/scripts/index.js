// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import tradesArtifact from '../../build/contracts/Trades.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const Trades = contract(tradesArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account
let trades

const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    Trades.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]

      self.refreshBalance()
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  // refreshBalance: function () {
  //   const self = this

  //   let meta
  //   MetaCoin.deployed().then(function (instance) {
  //     meta = instance
  //     return meta.getBalance.call(account, { from: account })
  //   }).then(function (value) {
  //     const balanceElement = document.getElementById('balance')
  //     balanceElement.innerHTML = value.valueOf()
  //   }).catch(function (e) {
  //     console.log(e)
  //     self.setStatus('Error getting balance; see log.')
  //   })
  // },

  // sendCoin: function () {
  //   const self = this

  //   const amount = parseInt(document.getElementById('amount').value)
  //   const receiver = document.getElementById('receiver').value

  //   this.setStatus('Initiating transaction... (please wait)')

  //   let meta
  //   MetaCoin.deployed().then(function (instance) {
  //     meta = instance
  //     return meta.sendCoin(receiver, amount, { from: account })
  //   }).then(function () {
  //     self.setStatus('Transaction complete!')
  //     self.refreshBalance()
  //   }).catch(function (e) {
  //     console.log(e)
  //     self.setStatus('Error sending coin; see log.')
  //   })
  // },

  createTrade: function (){
    const self = this

    const amount = parseInt(document.getElementById('amount').value)
    const title = document.getElementById('title').value
    const detail = document.getElementById('detail').value

    this.setStatus('Creating a trade... (please wait)')

    let meta
    Trades.deployed().then(function (instance) {
      meta = instance
      return meta.createTrade(title, detail, {value:amount, from:account, gas:6000000})
    }).then(function () {
      self.setStatus('Creation complete!')
      self.getCount()
    }).catch(function (e) {
      console.log(e)
      // alert(e)
      self.setStatus(e)
    })
  },

  showTrades: function (){
    const self = this

    const count = self.getCount()

    this.setStatus('Getting the information of the trades...')

    for (var index = 0; index < count; index++)
      {
        alert(index)
        if (Trades.deployed().validId(index) == false){
          continue
        }
        else{
          this.getTrade(index)
        }
      }
  },
  
  getTrade: function (id){
    const self = this

    this.setStatus('Getting a trade... (please wait)')
    alert(1111)

    let meta
    Trades.deployed().then(function (instance) {
      meta = instance
      return meta.getTrade(id, { from:account })
    }).then(function ([title_, detail_, state_]) {
      self.setStatus('Trade getting complete!')
      var tradesTable = document.getElementById('tradesTable')
      var newRow = tradesTable.insertRow();
      var newCol0 = newRow.insertCell();
      var newCol1 = newRow.insertCell();
      var newCol2 = newRow.insertCell();
      var newCol3 = newRow.insertCell();
      newCol0.innerText = id;
      newCol1.innerText = title_;
      newCol2.innerText = detail_;
      newCol3.innerText = state_;
    }).catch(function (e) {
      console.log(e)
      self.setStatus(e)
    })
  },

  getCount: function (){
    const self = this

    this.setStatus('Getting the count... (please wait)')

    let meta
    Trades.deployed().then(function (instance) {
      meta = instance
      return meta.showCount()
    }).then(function (value) {
      self.setStatus('Count getting complete!')
      const countElement = document.getElementById('count')
      countElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      // alert(e)
      self.setStatus(e)
    })
  }

}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
