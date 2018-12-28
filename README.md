# Trades

![overview](https://github.com/huangyt39/Trades/blob/master/pic/overview.png?raw=true)

## 选题背景和依据

### 构思

​	本dapp是一个基于校园社区这一天然社区圈子而开发的互助类dapp，其主要目的为利用智能合约的特点解决大学校园中交易、求助等消息难以传播、交易诚信的问题。本dapp旨在方便在校学生进行物品交易、有偿或无偿求助等活动

### 选题背景

​	当下，校园中存在大量的交易：闲置二手物品交易、选课时期的换课交易等等，也存在一些求助类的需求：找校卡、外卖拼单、求课程资料等等。而这些交易和求助信息由于没有一个成熟的平台，往往通过微信朋友圈这样相对信息比较闭塞的平台发布出来，毕竟微信好友就那么多，会帮忙转发的也不在多数，大多数情况下这些信息会流失，交易、互助也随之流产，十分可惜。

​	根据本人的调查，有一些别的学校已经出现了这种互助类的app，通过一个专门运营的微信号或者微信小程序来实现这些信息的发布和接受。很可惜本校还没有出现这样的app。

​	但是这样的app同样存在着一些问题：交易的诚信问题。这样的app是没有一个交易中介的（app运营者主要负责消息的发布和接受），这就导致了交易的双方均无法保证先交付成果或报酬后，对方会不会毁约。除此之外，因为app运营者的盈利需要，发布交易或者互助类消息均需要一定量的佣金，这也一定程度上对交易者不利。

​	在学习了区块链之后，发现智能合约的特点十分适合应用在这个情境下，只有双方都确认交易完成时，才会完成转账，如果双方无法达成共识则可以取消交易，很好的解决了交易诚信的问题。而且发布信息的门槛也会降低，同时也有利于新用户的加入

## 使用说明

- 首先安装geth，创建account并unlock后开始挖矿（注意端口可能需要改变

  ```
  geth --networkid 666 --nodiscover --datadir chain0 --port 30303 --rpc --rpcapi 		net,eth,web3,personal --rpcport 9545 --rpcaddr localhost console 2>>geth1.log
  personal.newAccount("")
  personalunlockAccount(eth.accounts[0])
  miner.start()
  # miner.stop()
  ```

- 查看日志文件确认开始挖矿之后，在命令行中打开主目录，执行以下命令进行部署

  ```
  truffle --networks clean
  truffle migrate --network geth --reset
  ```

- npm自动化任务

  ```
  npm run dev
  ```

- 在浏览器中打开127.0.01:8080就可以看到dapp的界面了

- 新建几个账户并转入一些币用于测试，查看账户

  ```
  personal.newAccount("")
  personal.newAccount("")
  personal.newAccount("")
  eth.sendTransaction({from:eth.accounts[0], to:eth.accounts[1], 						value:web3.toWei(1, "ether")})
  eth.sendTransaction({from:eth.accounts[0], to:eth.accounts[2], 						value:web3.toWei(1, "ether")})
  eth.sendTransaction({from:eth.accounts[0], to:eth.accounts[3], 						value:web3.toWei(1, "ether")})
  ```

- 注意在运行程序的过程中不能停止挖矿

## 测试

#### 登录

![login](https://github.com/huangyt39/Trades/blob/master/pic/login.png?raw=true)

输入用户（如User0、User1...）和地址，点击登录按钮，如果用户与地址匹配，登录成功，否则登录失败

##### 登录成功

![loginSuccess](https://github.com/huangyt39/Trades/blob/master/pic/loginSuccess.png?raw=true)

若登录成功，当前用户切换为登录用户，交易也同步刷新

##### 登录失败

![loginFail](https://github.com/huangyt39/Trades/blob/master/pic/loginFail.png?raw=true)

若登录失败、用户或地址为空则弹窗警示，当前用户不会改变

#### 刷新交易

![refresh](https://github.com/huangyt39/Trades/blob/master/pic/refresh.png?raw=true)

点击刷新按钮可以刷新相应表格中的交易信息

#### 创建交易

记录此时User1与User2的Balance，与完成交易后的对比

```
eth.getBalance(eth.accounts[0])
eth.getBalance(eth.accounts[1])
```

结果如下：

```
1000
1000
```

点击新建交易按钮创建交易

![create](https://github.com/huangyt39/Trades/blob/master/pic/create.png?raw=true)

创建完成后其他人视角：

![accepct](https://github.com/huangyt39/Trades/blob/master/pic/accepct.png?raw=true)



输入交易的标题、细节和价格创建，交易发起人为当前用户，交易发起人向合约转入相应价格的币。交易创建后状态为待接受，会出现在其他用户的可接受交易池中，同时当前用户可以在与我有关的交易中看到

#### 接受交易

接受前：

![accepct](https://github.com/huangyt39/Trades/blob/master/pic/accepct.png?raw=true)

接受后：

![accepct](https://github.com/huangyt39/Trades/blob/master/pic/accepct2.png?raw=true)

接受交易后，交易状态转变为待完成，当前用户成为交易接受人，同时可以在与我有关的交易中看到，同时交易发起人可以看到交易状态转变为待完成

#### 完成交易

![finish](https://github.com/huangyt39/Trades/blob/master/pic/finish.png?raw=true)

完成交易后，交易状态转变为待确认，等待交易发起人进行确认

此时再次输出User1与User2的Balance，与进行交易前做对比

```
eth.getBalance(eth.accounts[0])
eth.getBalance(eth.accounts[1])
```

结果如下：

```
1025
975
```

点击新建交易按钮创建交易

#### 确认交易

![comfirm](https://github.com/huangyt39/Trades/blob/master/pic/comfirm.png?raw=true)

确认交易后，交易状态转变为已确认，合约向交易接受人转入相应价格的币。已经被确认的交易会保留在发起人和接受人的与其相关的交易中

#### 撤销交易

![destory](https://github.com/huangyt39/Trades/blob/master/pic/destory.png?raw=true)

只有当交易状态为未接受时，发起人才能撤销交易，撤销后发起人也无法查询到该交易

## github地址

https://github.com/