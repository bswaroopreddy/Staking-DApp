// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

import './RWD.sol';
import './Tether.sol';
import './ERC20.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    ERC20 public erc20;
    RWD public rwd;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    constructor(RWD _rwd, Tether _tether, ERC20 _erc20) {
        rwd = _rwd;
        tether = _tether;
        erc20 = _erc20;
        owner = msg.sender;
    }

    // Staking function
    function depositTokens(uint256 _amount) public {
        // Require staking amount to be greater than zero
        require(_amount > 0, 'Amount cannot be zero');
        // Transfer tether tokens to this contract for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        // Update staking balance
        stakingBalance[msg.sender] += _amount;
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // Issue rewards
    function issueTokens() public {
        // require the owner to issue tokens
        require(msg.sender == owner, 'caller must be the owner');

        for(uint i = 0; i < stakers.length; i++){
            address recipient = stakers[i];
            uint reward = stakingBalance[recipient] / 9;
            if(reward > 0) {
                 rwd.transfer(recipient, reward);
            }
        }
    }

    // Unstaking
    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];
        // require the amount to be greater than zero
        require(balance > 0, 'Staking Balance cannot be less than zero');

        // transfer the tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);
        stakingBalance[msg.sender] -= balance;

        // Update Staking Status
        isStaking[msg.sender] = false;

    }
}