pragma solidity ^0.4.18;

contract Trades{

    enum tradeState {Unaccept, Unfinish, Uncomfirm, End}

    event StateTranslate(uint _id, tradeState _state, uint _price,bool _success);

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

    address public owner;
    mapping (uint => bool) public validTrade;
    mapping (uint => trade) public tradeReceived;
    trade[] public TradePool;
    uint count;
    uint public minPrice;

    constructor() public {
        count = 0;
        minPrice = 0;
        owner = msg.sender;
    }

    function createTrade(string title_, string detail_) payable public {
        if (msg.value < minPrice){
            emit StateTranslate(count, tradeState.Unaccept, msg.value, false);
            return;
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
        emit StateTranslate(count-1, tradeReceived[count-1].state, tradeReceived[count-1].price, true);
    }

    function acceptTrade(uint id) public {
        require(validTrade[id], "unvalid id");

        trade storage tmptrade = tradeReceived[id];
        if (tmptrade.state != tradeState.Unaccept || tmptrade.initiatorAddress == msg.sender){
            emit StateTranslate(tmptrade.id, tmptrade.state, tmptrade.price, false);
            return;
        }
        tmptrade.recipientAddress = msg.sender;
        tmptrade.state = tradeState.Unfinish;
        emit StateTranslate(tmptrade.id, tmptrade.state, tmptrade.price, true);
    }

    function finishTrade(uint id, string info) public{
        require(validTrade[id], "unvalid id");

        trade storage tmptrade = tradeReceived[id];
        if (tmptrade.state != tradeState.Unfinish || tmptrade.recipientAddress != msg.sender){
            emit StateTranslate(tmptrade.id, tmptrade.state, tmptrade.price, false);
            return;
        }
        tmptrade.finishInfo = info;
        tmptrade.state = tradeState.Uncomfirm;
        emit StateTranslate(tmptrade.id, tmptrade.state, tmptrade.price, true);
    }

    function comfirmTrade(uint id) public{
        require(validTrade[id], "unvalid id");

        trade storage tmptrade = tradeReceived[id];
        if(tmptrade.state != tradeState.Uncomfirm || msg.sender != tmptrade.initiatorAddress){
            emit StateTranslate(tmptrade.id, tmptrade.state, tmptrade.price, false);
            return;
        }
        tradeReceived[id].comfirm = true;
        tradeReceived[id].state = tradeState.End;
        owner.transfer(tradeReceived[id].price);
        validTrade[id] = false;
        emit StateTranslate(tmptrade.id, tmptrade.state, tmptrade.price, true);
    }
    
    function showCount() view public returns (uint Count){
        return count;
    }

    function fund() external payable {}
}
