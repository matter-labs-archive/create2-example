//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.8;

import "./Counter.sol";


contract Deployer {
    event Deployed(address);
  function deployCreate2(bytes32 _salt) external {
      address counter = address(new Counter{salt: _salt}());
      emit Deployed(counter);
  }
}
