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

      // self.refreshBalance()
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  createTrade: function (){
    const self = this
    if (document.getElementById('title').value == ""){
      alert("标题不能为空！")
      return;
    }
    if (document.getElementById('amount').value == ""){
      alert("价格不能为空！")
      return;
    }
    if (parseInt(document.getElementById('amount').value) <= 0){
      alert("价格必须大于0！")
      return;
    }
    const amount = parseInt(document.getElementById('amount').value)
    const title = document.getElementById('title').value
    const detail = document.getElementById('detail').value
    
    

    this.setStatus('Creating a trade... (please wait)')

    let meta
    Trades.deployed().then(function (instance) {
      meta = instance
      return meta.createTrade(title, detail, {value:amount, from:account, gas:6000000})
    }).then(function () {
      self.setStatus('创建交易成功！')
      self.getCount()
    }).catch(function (e) {
      console.log(e)
      // alert(e)
      self.setStatus(e)
    })
  },

  showTrades: function (){
    const self = this

    var tradesTable = document.getElementById('tradesTable')
    var rowNum = tradesTable.rows.length;
     for (i=1;i<rowNum;i++)
     {
      tradesTable.deleteRow(i);
         rowNum=rowNum-1;
         i=i-1;
     }

    self.getCount()
    const count = parseInt(document.getElementById('count').innerHTML)

    this.setStatus('正在获取交易的信息...')

    var indexArr = []
    for (var i = 0;i < count;i ++){
      indexArr.push(i);
    }

    while(indexArr.length != 0)
      {
        let index = indexArr.pop()
        let meta
        Trades.deployed().then(function (instance) {
          meta = instance
          return meta.validId(index)
        }).then(function (value) {
          if(value == true){
            self.getTrade(index)
          }
          else{
            // alert("invalid id:")
            // alert(index)
          }
        }).catch(function (e) {
          console.log(e)
          self.setStatus(e)
        })

      }
  },

  showPersonalTrades: function (){
    const self = this

    var tradesTable = document.getElementById('personalTradesTable')
    var rowNum = tradesTable.rows.length;
     for (i=1;i<rowNum;i++)
     {
      tradesTable.deleteRow(i);
         rowNum=rowNum-1;
         i=i-1;
     }

    self.getCount()
    const count = parseInt(document.getElementById('count').innerHTML)
    document.getElementById('personalCount').innerHTML = 0;

    this.setStatus('正在获取交易的信息...')

    var indexArr = []
    for (var i = 0;i < count;i ++){
      indexArr.push(i);
    }

    while(indexArr.length != 0)
      {
        let index = indexArr.pop()
        let meta
        Trades.deployed().then(function (instance) {
          meta = instance
          return meta.validId(index)
        }).then(function (value) {
          if(value == true){
            if(self.getPersonalTrade(index)){
              personalCount += 1;
            }
          }
          else{
            // alert("invalid id:")
            // alert(index)
          }
        }).catch(function (e) {
          console.log(e)
          self.setStatus(e)
        })

      }

      self.setStatus('交易读取完成！');

  },
  
  acceptTrade: function (id){
    const self = this
    this.setStatus('正在接受交易...');

    let meta
    Trades.deployed().then(function (instance) {
      meta = instance
      // console.log(parseInt(id));
      return meta.acceptTrade(parseInt(id), { from:account })
    }).then(function () {
      self.setStatus('接受交易成功！')
    }).catch(function (e) {
      console.log(e)
      // alert(e)
      self.setStatus(e)
    })
  },

  getTrade: function (id){
    const tradeState = {0:'待接受', 1:'待完成', 2:'待确认', 3:'已确认', 4:'Destory'}
    const self = this
    this.setStatus('正在读取交易...')

    let meta
    Trades.deployed().then(function (instance) {
      meta = instance
      return meta.getTrade(id, { from:account })
    }).then(function ([title_, detail_, state_, price_, address_, raddress_]) {
      if(state_ != 0 || address_ == account){
        self.setStatus('交易读取完成！');
        return;
      }
      self.setStatus('交易读取完成！')
      var tradesTable = document.getElementById('tradesTable')
      var newRow = tradesTable.insertRow();
      var newCol0 = newRow.insertCell();
      var newCol1 = newRow.insertCell();
      var newCol2 = newRow.insertCell();
      var newCol3 = newRow.insertCell();
      var newCol4 = newRow.insertCell();
      var newCol5 = newRow.insertCell();
      var newCol6 = newRow.insertCell();
      newCol0.innerText = id;
      newCol1.innerText = title_;
      newCol2.innerText = detail_;
      newCol3.innerText = price_;
      newCol4.innerText = address_;
      newCol5.innerText = tradeState[state_];
      newCol6.innerHTML = '<button class="btn btn-default" id="acceptTrade" onclick="App.acceptTrade(parseInt(this.parentNode.parentNode.firstChild.innerHTML))">接受</button>';
    }).catch(function (e) {
      console.log(e)
      self.setStatus(e)
    })
  },

  getPersonalTrade: function (id){
    const tradeState = {0:'待接受', 1:'待完成', 2:'待确认', 3:'已确认', 4:'Destory'}
    const self = this
    this.setStatus('正在读取交易...')

    let meta
    Trades.deployed().then(function (instance) {
      meta = instance
      return meta.getTrade(id, { from:account })
    }).then(function ([title_, detail_, state_, price_, address_, raddress_]) {
      if(address_ != account && raddress_ != account){
        self.setStatus('交易读取完成！');
        return;
      }
      self.setStatus('交易读取完成！')
      var tradesTable = document.getElementById('personalTradesTable')
      var newRow = tradesTable.insertRow();
      var newCol0 = newRow.insertCell();
      var newCol1 = newRow.insertCell();
      var newCol2 = newRow.insertCell();
      var newCol3 = newRow.insertCell();
      var newCol4 = newRow.insertCell();
      var newCol5 = newRow.insertCell();
      var newCol6 = newRow.insertCell();
      newCol0.innerText = id;
      newCol1.innerText = title_;
      newCol2.innerText = detail_;
      newCol3.innerText = price_;
      newCol4.innerText = address_;
      newCol5.innerText = tradeState[state_];
      if(raddress_ == account && state_ == 1){
        newCol6.innerHTML = '<button class="btn btn-default" id="destoryTrade" onclick="App.finishTrade(parseInt(this.parentNode.parentNode.firstChild.innerHTML))">完成</button>';
      }
      if(raddress_ == account && state_ == 3){
        newCol6.innerText = "已被确认";
      }
      if(address_ == account && state_ == 3){
        newCol6.innerText = "已确认";
      }
      if(address_ == account && state_ == 0){
        newCol6.innerHTML = '<button class="btn btn-default" id="destoryTrade" onclick="App.destoryTrade(parseInt(this.parentNode.parentNode.firstChild.innerHTML))">撤销</button>';
      }
      if(address_ == account && state_ == 2){
        newCol6.innerHTML = '<button class="btn btn-default" id="destoryTrade" onclick="App.comfirmTrade(parseInt(this.parentNode.parentNode.firstChild.innerHTML))">确认</button>';
      }
      let tmpCount = parseInt(document.getElementById('personalCount').innerHTML);
      document.getElementById('personalCount').innerHTML = tmpCount +1;
    }).catch(function (e) {
      console.log(e)
      self.setStatus(e)
    })
  },

  finishTrade: function (id){
    const self = this
    this.setStatus('正在完成交易...');

    console.log(account);
    let meta
    Trades.deployed().then(function (instance) {
      meta = instance
      return meta.finishTrade(parseInt(id), { from:account })
    }).then(function () {
      self.setStatus('完成交易完成！');
      self.getPersonalTrade();
    }).catch(function (e) {
      console.log(e)
      // alert(e)
      self.setStatus(e)
    })
  },

  comfirmTrade: function (id){
    const self = this
    this.setStatus('正在确认交易...');

    console.log(account);
    let meta
    Trades.deployed().then(function (instance) {
      meta = instance
      return meta.comfirmTrade(parseInt(id), { from:account })
    }).then(function () {
      self.setStatus('确认交易完成！')
      self.getPersonalTrade();
    }).catch(function (e) {
      console.log(e)
      // alert(e)
      self.setStatus(e)
    })
  },

  destoryTrade: function (id){
    const self = this
    this.setStatus('正在撤销交易...');

    console.log(account);
    let meta
    Trades.deployed().then(function (instance) {
      meta = instance
      return meta.destoryTrade(parseInt(id), { from:account })
    }).then(function () {
      self.setStatus('撤销交易完成！')
      self.getPersonalTrade();
    }).catch(function (e) {
      console.log(e)
      // alert(e)
      self.setStatus(e)
    })
  },

  getCount: function (){
    const self = this

    this.setStatus('正在读取交易数量...')

    let meta
    Trades.deployed().then(function (instance) {
      meta = instance
      return meta.showCount()
    }).then(function (value) {
      self.setStatus('交易数量读取完成！')
      const countElement = document.getElementById('count')
      countElement.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      // alert(e)
      self.setStatus(e)
    })
  },

  login : function ()
        {
            var oCreate = document.getElementById('login');
            var oCreateBox = document.getElementById('login-box');
            var oOver = document.getElementById('over');
            var oClose2 = document.getElementById('close');
            var oUserName = document.getElementById('username');
            var oPasswd = document.getElementById('passwd');
            var loginbtn = document.getElementById('loginbtn');
            oCreate.onclick = function ()
            {
                oCreateBox.style.display = 'block';
                oOver.style.display = 'block';
                oCreateBox.style.zIndex = 1;  //设置元素的显示优先层级，zIndex越高,优先级越高，通俗点就是往上覆盖.
            };
            oClose2.onclick = function ()
            {
                oCreateBox.style.display = 'none';
                oOver.style.display = 'none';
            };
            oUserName.onclick = function ()
            {
                oUserName.value='';   //清除提示文字
            };
            oPasswd.onfocus = function ()
            {
                oPasswd.value='';   //清除提示文字
                oPasswd.type = 'password'; //把文本框类型设为密码
            }
            loginbtn.onclick = function ()
            {
              if (oUserName.value == ""){
                alert("用户名不能为空");
              }
              account = oUserName.value;
              oCreateBox.style.display = 'none';
              oOver.style.display = 'none';
              oUserName.value = "";
              oPasswd.value = "";
              const countElement = document.getElementById('account');
              countElement.innerHTML = account;
            }
        },

  createBox : function ()
        {
            var oCreate = document.getElementById('createBox');
            var oCreateBox = document.getElementById('create-box');
            var oOver2 = document.getElementById('over2');
            var oClose2 = document.getElementById('close2');
            var oUserName = document.getElementById('username');
            var oPasswd = document.getElementById('passwd');
            // var createbtn = document.getElementById('create');
            oCreate.onclick = function ()
            {
                oCreateBox.style.display = 'block';
                oOver2.style.display = 'block';
                oCreateBox.style.zIndex = 1;  //设置元素的显示优先层级，zIndex越高,优先级越高，通俗点就是往上覆盖.
            };
            oClose2.onclick = function ()
            {
                oCreateBox.style.display = 'none';
                oOver2.style.display = 'none';
            };
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
