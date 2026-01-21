// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.28;

contract ERC20 {
    // Metad ata
    string public name = "ERC20";
    string public symbol = 'mUSDT';
    uint256 public totalSupply = 1000000 * 10**18;   // 1 million tokens
    uint8 public decimals = 18;

    // Events
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    event Approval (
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    // Storage
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // COnstructor
    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    // ERC20 Functions
    function transfer(address _to, uint256 _value) external returns(bool success){
        _transfer(msg.sender, _to, _value);
        return true;
    }

    
    function approve(address _spender, uint256 _value) external returns (bool success){
        _approve(msg.sender, _spender, _value);
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success) {
        require(balanceOf[_from] >= _value);
        uint256 currentAllowance = allowance[_from][msg.sender];
        require(currentAllowance >= _value);
        
        _approve(_from, msg.sender, currentAllowance - _value);
        _transfer(_from, _to, _value);
        
        return true;
    }


    // Allowance helpers
    // Initial state: allowance[Alice][DEX] = 100, 
    // Alice wants to reduce allowance to 50: approve(DEX, 50)
    // Attacker front-runs: DEX sees the transaction in mempool and executes: transferFrom(Alice, DEX, 100)
    // Then Alice's tx executes: allowance[Alice][DEX] = 50
    // Final result: Total spent = 150 tokens
    // allowance race-condition mitigation prevents attackers from spending more tokens than the owner intended

    function increaseAllowance(address _spender, uint256 _addedValue) external returns(bool success) {
        _approve(msg.sender, _spender, allowance[msg.sender][_spender] + _addedValue);
        return true;
    }

    function decreaseAllowance(address _spender, uint256 _subtractedValue) external returns(bool success) {
        _approve(msg.sender, _spender, allowance[msg.sender][_spender] - _subtractedValue);
        return true;
    }


    // Internal logic
    // zero-checks Prevents: 1. Token loss, 2.Invalid approvals, 3.Phantom transfers
    function _transfer(address _from, address _to, uint256 _value) internal
     {
        require(_from != address(0), "ERC20: transfer from zero address");
        require(_to != address(0), "ERC20: transfer to zero address");

        // require thet  the value is greter or equal to _value
        require(balanceOf[msg.sender] >= _value, "ERC20: transfer amount exceeds balance");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
    }

    function _approve(address _owner, address _spender, uint256 _value) internal{
        require(_owner != address(0), "ERC20: Approval from zero account");
        require(_spender != address(0), "ERC20: Approval to zero account");

        allowance[_owner][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
    }

}