const Trades = artifacts.require('./Trades.sol')
const truffleAssert = require('truffle-assertions');

contract('Trades', async (accounts) => {
    let trades;
    const Account0 = accounts[0];
    const Account1 = accounts[1];
    const fundingAccount = accounts[2];
    const fundingSize = 100;

    beforeEach('setup contract for each test', async function () {
        trades = await Trades.new({from: fundingAccount});
        await trades.fund({from: fundingAccount, value:fundingSize});
        // assert.equal(web3.eth.getBalance(trades.address).toNumber(), fundingSize);
    })

    it('test showCount function', async () => {
        assert.equal(await trades.showCount(), 0)

        let tx = await trades.createTrade("testTitle","testDetail", {value: 100, from: Account0});
        truffleAssert.eventEmitted(tx, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 0;
        });
        assert.equal(await trades.showCount(), 1)

        let tx2 = await trades.createTrade("testTitle2","testDetail2", {value: 100, from: Account0});
        truffleAssert.eventEmitted(tx2, 'StateTranslate', (ev) => {
            return ev._id == 1 && ev._success == true && ev._state == 0;
        });
        assert.equal(await trades.showCount(), 2)

        let tx3 = await trades.createTrade("testTitle2","testDetail2", {value: 100, from: Account0});
        truffleAssert.eventEmitted(tx3, 'StateTranslate', (ev) => {
            return ev._id == 2 && ev._success == true && ev._state == 0;
        });
        assert.equal(await trades.showCount(), 3)
    })

    it('test getTrade function', async () => {
        assert.equal(await trades.showCount(), 0)

        let tx = await trades.createTrade("testTitle","testDetail", {value: 100, from: Account0});
        truffleAssert.eventEmitted(tx, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 0;
        });
        assert.equal(await trades.showCount(), 1)
        var items = await trades.showTrade(0)
        console.log(items)
    })

    it("Compele a trade", async () => {

        let account0BalBefo = await web3.eth.getBalance(Account0).toNumber();
        let account1BalBefo = await web3.eth.getBalance(Account1).toNumber();

        let tx = await trades.createTrade("testTitle","testDetail", {value: 100, from: Account0});
        truffleAssert.eventEmitted(tx, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 0;
        });

        assert.equal(web3.eth.getBalance(trades.address).toNumber(), fundingSize + 100, 'balance after create trade');

        let tx2 = await trades.acceptTrade(0, {from: Account1});
        truffleAssert.eventEmitted(tx2, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 1;
        });
        
        let tx3 = await trades.finishTrade(0, "Finish", {from: Account1});
        truffleAssert.eventEmitted(tx3, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 2;
        });

        let tx4 = await trades.comfirmTrade(0, {from: Account0});
        truffleAssert.eventEmitted(tx4, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 3;
        });

        assert.equal(web3.eth.getBalance(trades.address).toNumber(), fundingSize, 'balance after finish trade');

        assert.equal(await trades.showCount(), 1);

        let account0BalAft = await web3.eth.getBalance(Account0).toNumber();
        let account1BalAft = await web3.eth.getBalance(Account1).toNumber();

        // assert.equal(account0BalBefo, account0BalAft + 100, 'error in balance change of account0');
        // assert.equal(account1BalBefo, account1BalAft - 100, 'error in balance change of account1');
    })

    it("Accpected by the same account as create", async () => {

        let tx = await trades.createTrade("testTitle","testDetail", {value: 100, from: Account0});
        truffleAssert.eventEmitted(tx, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 0;
        });

        assert.equal(web3.eth.getBalance(trades.address).toNumber(), fundingSize + 100, 'balance after create trade');

        let tx2 = await trades.acceptTrade(0, {from: Account0});
        truffleAssert.eventEmitted(tx2, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == false && ev._state == 0;
        });

        assert.equal(await trades.showCount(), 1)
        
    })

    it("Finished by the wrong account", async () => {

        let tx = await trades.createTrade("testTitle","testDetail", {value: 100, from: Account0});
        truffleAssert.eventEmitted(tx, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 0;
        });

        assert.equal(web3.eth.getBalance(trades.address).toNumber(), fundingSize + 100, 'balance after create trade');

        let tx2 = await trades.acceptTrade(0, {from: Account1});
        truffleAssert.eventEmitted(tx2, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 1;
        });
        
        let tx3 = await trades.finishTrade(0, "Finish", {from: Account0});
        truffleAssert.eventEmitted(tx3, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == false && ev._state == 1;
        });

        assert.equal(await trades.showCount(), 1)
    })

    it("Confirmed by the wrong account", async () => {

        let account0BalBefo = await web3.eth.getBalance(Account0).toNumber();
        let account1BalBefo = await web3.eth.getBalance(Account1).toNumber();

        let tx = await trades.createTrade("testTitle","testDetail", {value: 100, from: Account0});
        truffleAssert.eventEmitted(tx, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 0;
        });

        assert.equal(web3.eth.getBalance(trades.address).toNumber(), fundingSize + 100, 'balance after create trade');

        let tx2 = await trades.acceptTrade(0, {from: Account1});
        truffleAssert.eventEmitted(tx2, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 1;
        });
        
        let tx3 = await trades.finishTrade(0, "Finish", {from: Account1});
        truffleAssert.eventEmitted(tx3, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 2;
        });

        let tx4 = await trades.comfirmTrade(0, {from: Account1});
        truffleAssert.eventEmitted(tx4, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == false && ev._state == 2;
        });

        assert.equal(await trades.showCount(), 1)
    })

    it("Destory before accpected", async () => {

        let tx = await trades.createTrade("testTitle","testDetail", {value: 100, from: Account0});
        truffleAssert.eventEmitted(tx, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 0;
        });

        assert.equal(web3.eth.getBalance(trades.address).toNumber(), fundingSize + 100, 'balance after create trade');

        let tx2 = await trades.destoryTrade(0, {from: Account0});
        truffleAssert.eventEmitted(tx2, 'StateTranslate', (ev) => {
            return ev._id == 0 && ev._success == true && ev._state == 4;
        });

        assert.equal(await trades.showCount(), 1)
        
    })

})