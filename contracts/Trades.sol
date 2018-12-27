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
        // if (msg.value < minPrice){
        //     emit StateTranslate(count, tradeState.Unaccept, msg.value, false);
        //     return;
        // }
        require(msg.value > minPrice, "smaller than minPrice!");

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
        // emit StateTranslate(count-1, tradeReceived[count-1].state, tradeReceived[count-1].price, true);
    }

    function acceptTrade(uint id) public {
        require(validTrade[id], "unvalid id");

        trade storage tmptrade = tradeReceived[id];
        require(tmptrade.state == tradeState.Unaccept, "The state of the trade is not Unaccept");
        require(msg.sender != tmptrade.initiatorAddress, "The initiatorAddress of the trade is the sender");
        
        tmptrade.recipientAddress = msg.sender;
        tmptrade.state = tradeState.Unfinish;
        emit StateTranslate(tmptrade.id, tmptrade.state, tmptrade.price, true);
    }

    function finishTrade(uint id) public{
        require(validTrade[id], "unvalid id");

        trade storage tmptrade = tradeReceived[id];
        require(tmptrade.state == tradeState.Unfinish, "The state of the trade is not Unfinish");
        require(msg.sender == tmptrade.recipientAddress, "The recipientAddress of the trade is not the sender");
        
        tmptrade.state = tradeState.Uncomfirm;
        // emit StateTranslate(tmptrade.id, tmptrade.state, tmptrade.price, true);
    }

    function comfirmTrade(uint id) public{
        require(validTrade[id], "unvalid id");

        trade storage tmptrade = tradeReceived[id];
        require(tmptrade.state == tradeState.Uncomfirm, "The state of the trade is not Uncomfirm");
        require(msg.sender == tmptrade.initiatorAddress, "The initiatorAddress of the trade is not the sender");
        
        tradeReceived[id].comfirm = true;
        tradeReceived[id].state = tradeState.End;
        owner.transfer(tradeReceived[id].price);
        // emit StateTranslate(tmptrade.id, tmptrade.state, tmptrade.price, true);
    }
    
    function destoryTrade(uint id) public{
        require(validTrade[id], "unvalid id");
        
        trade storage tmptrade = tradeReceived[id];
        require(tmptrade.state == tradeState.Unaccept, "The state of the trade is not Unaccept");
        require(msg.sender == tmptrade.initiatorAddress, "The address of the trade is not the sender");

        owner.transfer(tradeReceived[id].price);
        tradeReceived[id].state = tradeState.Destory;
        validTrade[id] = false;
        validCount -= 1;
    }

    function showCount() view public returns (uint){
        return count;
    }

    function getTrade(uint id) view public returns (string memory, string memory, uint, uint, address, address){
        require(validTrade[id], "unvalid id");

        trade storage tmptrade = tradeReceived[id];
        string memory title_ = tmptrade.title;
        string memory detail_ = tmptrade.detail;
        return (title_, detail_, uint(tmptrade.state), tmptrade.price, tmptrade.initiatorAddress, tmptrade.recipientAddress);
    }

    function validId(uint id) view public returns (bool){
        return validTrade[id];
    } 

    function fund() external payable {}
}
