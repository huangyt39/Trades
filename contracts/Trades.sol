pragma solidity ^0.5.1;

contract Trades{

    enum tradeState {Unaccept, Unfinish, Uncomfirm, End, Destory}

    event StateTranslate(uint _id, tradeState _state, uint _price,bool _success);

    struct trade{
        //创建者地址
        address initiatorAddress;
        //接受者地址
        address recipientAddress;
        //交易标题
        string title;
        //交易细节
        string detail;
        //交易价格
        uint price;
        //交易id
        uint id;
        //交易状态
        tradeState state;
        //完成信息
        string finishInfo;
        //是否确认
        bool comfirm;
    }

    address payable public owner;
    mapping (uint => bool) public validTrade;
    mapping (uint => trade) public tradeReceived;
    trade[] public TradePool;
    uint validCount;
    uint count;
    uint public minPrice;

    constructor() public {
        validCount = 0;
        count = 0;
        minPrice = 0;
        owner = msg.sender;
    }

    function createTrade(string memory title_, string memory detail_) payable public {
        if (msg.value < minPrice){
            emit StateTranslate(count, tradeState.Unaccept, msg.value, false);
            return;
        }
        trade memory item = trade({
            initiatorAddress: msg.sender,
            recipientAddress: msg.sender,
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
        validCount += 1;
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

    function finishTrade(uint id, string memory info) public{
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
    
    function destoryTrade(uint id) public{
        require(validTrade[id], "unvalid id");

        trade storage tmptrade = tradeReceived[id];
        if(tmptrade.state != tradeState.Unaccept || msg.sender != tmptrade.initiatorAddress){
            emit StateTranslate(tmptrade.id, tradeState.Destory, tmptrade.price, false);
            return;
        }
        owner.transfer(tradeReceived[id].price);
        tradeReceived[id].state = tradeState.Destory;
        validTrade[id] = false;
        validCount -= 1;
        emit StateTranslate(tmptrade.id, tmptrade.state, tmptrade.price, true);
    }

    function showCount() view public returns (uint){
        return count;
    }

    function getTrade(uint id) view public returns (string memory, string memory, uint){
        require(validTrade[id], "unvalid id");

        trade storage tmptrade = tradeReceived[id];
        string memory title_ = tmptrade.title;
        string memory detail_ = tmptrade.detail;
        return (title_, detail_, uint(tmptrade.state));
    }

    function validId(uint id) view public returns (bool){
        return validTrade[id];
    } 

    function fund() external payable {}
}
