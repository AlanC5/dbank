// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  //add minter variable
  address public minter;

  //add minter changed event
  event MinterChanged(address indexed from, address to);

  constructor() public payable ERC20("Star Coin", "STAR") {
    //asign initial minter
    minter = msg.sender;
  }

  //Add pass minter role function
  function passMinterRole(address _dBank) public returns (bool) {
    require(msg.sender == minter, "Only minter can pass minter role");
    minter = _dBank;

    emit MinterChanged(msg.sender, _dBank);
    return true;
  }

  function mint(address _account, uint256 _amount) public {
    //check if msg.sender have minter role
    require(msg.sender == minter, "Only minter can mint");
		_mint(_account, _amount);
	}
}