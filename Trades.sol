pragma solidity ^0.4.18;

contract Trades{

    enum tradeState {Unaccept, Unfinish, Uncomfirm, End}

    struct trade{
        address initiatorAddress;
        address recipientAddress;
        string title;
        string detail;
        uint price;
        uint id;
        tradestate state;
        string finishInfo;
        bool comfirm;
    }

    mapping (uint => trade) public tradeReceived;
    trade[] public TradePool;
    uint count;
    unit minPrice;

    function Trades() public {
        count = 0;
        minPrice = 0;
    }

    function createTrade(string title_, string detail_) payable public returns (bool success) {
        if (msg.value < minPrice){
            return false;
        }
        trade memory item = Trade({
            initiatorAddress: msg.sender,
            recipientAddress: 0,
            title: title_,
            detail: detail_,
            price: msg.value,
            id: count,
            state : tradeState.Unaccept,
            finishInfo: "",
            comfirm: false
        });
        TradePool.push(item);
        tradeReceived[count] = item;
        count += 1;
    }

    function acceptTrade(uint id) public returns (bool success) {
        trade tmptrade = tradeReceived[id];
        if (tmptrade.state != tradeState.Unaccept || tmptrade.initiatorAddress == msg.sender){
            return false;
        }
        tmptrade.recipientAddress = msg.sender;
        tmptrade.state = tradeState.Unfinish;
        return true;
    }

    function finishTrade(uint id, string info) public returns (bool success){
        trade tmptrade = tradeReceived[id];
        if (tmptrade.state != tradeState.Unfinish || tmptrade.recipientAddress != msg.sender){
            return false;
        }
        tmptrade.finishInfo = info;
        tmptrade.state = tradeState.Uncomfirm;
        return true;
    }

    function comfirmTrade(uint id) public returns (bool success){
        trade tmptrade = tradeReceived[id];
        if(tmptrade.state != tradeState.Uncomfirm || msg.sender != tmptrade.initiatorAddress){
            return false;
        }
        tradeReceived[id].comfirm = true;
        tradeReceived[id].state = tradeState.End;
        tradeReceived[id].recipientAddress.transfer(tradeReceived[id].price)
        return true;
    }
    
}