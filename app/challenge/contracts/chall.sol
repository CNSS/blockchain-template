// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

contract Challenge {
    bool public isSolved;

    function sendFlag() public {
        isSolved = true;
    }
}
