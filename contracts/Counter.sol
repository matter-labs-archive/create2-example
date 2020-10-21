//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.8;


contract Counter {
  uint256 counter;

  constructor() public {
      counter = 0;
  }

  function inc() external {
      ++counter;
  }
}
