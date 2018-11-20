const Trades = artifacts.require('./Trades.sol')

contract('Trades', async (accounts) => {
    let trades

    beforeEach('setup contract for each test', async function () {
        trades = await Trades.new()
    })

    it('count equal 0', async function () {
        assert.equal(await trades.showCount(), 0)
    })

    it('count equal 1', async function () {
        const tradesAddress = await trades.address
        
        var event = await trades.createTrade("testTitle","testDetail",{value: web3.toWei('10', 'ether'), from: web3.eth.accounts[5]}).then(function() { done(); }).catch(done)

        assert.equal(await trades.showCount(), 1)
    })

})