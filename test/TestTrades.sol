pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Trades.sol";

contract TestTrades {

  Trades trades = Trades(DeployedAddresses.Trades());

  function testCreateTrade() public{
    bool expected = false;
    bytes32[] storage para1 = mload(add("title", 32));
    bytes32[] storage para2 = mload(add("title", 32));

    Assert.equal(para1, expected, "...");
  }

  function testGetCount() public {
    uint expected = 0;
    Assert.equal(0 , expected, "The count of the trades should be 0");
  }

}
