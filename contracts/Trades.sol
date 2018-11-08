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
        tradeState state;
        string finishInfo;
        bool comfirm;
    }

    mapping (uint => bool) public validTrade;
    mapping (uint => trade) public tradeReceived;
    trade[] public TradePool;
    uint count;
    uint minPrice;

    constructor() public {
        count = 0;
        minPrice = 0;
    }

    function createTrade(string title_, string detail_) payable public returns (string Info) {
        if (msg.value < minPrice){
            return "false";
        }
        trade memory item = trade({
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
        validTrade[count] = true;
        count += 1;
        return "create trade successfully!";
    }

    function acceptTrade(uint id) public returns (bool success) {
        require(validTrade[id]);

        trade storage tmptrade = tradeReceived[id];
        if (tmptrade.state != tradeState.Unaccept || tmptrade.initiatorAddress == msg.sender){
            return false;
        }
        tmptrade.recipientAddress = msg.sender;
        tmptrade.state = tradeState.Unfinish;
        return true;
    }

    function finishTrade(uint id, string info) public returns (bool success){
        require(validTrade[id]);

        trade storage tmptrade = tradeReceived[id];
        if (tmptrade.state != tradeState.Unfinish || tmptrade.recipientAddress != msg.sender){
            return false;
        }
        tmptrade.finishInfo = info;
        tmptrade.state = tradeState.Uncomfirm;
        return true;
    }

    function comfirmTrade(uint id) public returns (bool success){
        require(validTrade[id]);

        trade storage tmptrade = tradeReceived[id];
        if(tmptrade.state != tradeState.Uncomfirm || msg.sender != tmptrade.initiatorAddress){
            return false;
        }
        tradeReceived[id].comfirm = true;
        tradeReceived[id].state = tradeState.End;
        tradeReceived[id].recipientAddress.transfer(tradeReceived[id].price);
        validTrade[id] = false;
        return true;
    }
    
    function showCount() public returns (uint Count){
        return count;
    }

}