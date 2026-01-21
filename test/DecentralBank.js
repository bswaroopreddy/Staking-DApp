const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("DecentralBank contract", function () {
  let tether, rwd, erc20, bank;
  let owner;
  let result;

  beforeEach(async function () {
    [owner, investor, customer] = await ethers.getSigners();

    // Deploy Tether
    const Tether = await ethers.getContractFactory("Tether");
    tether = await Tether.connect(owner).deploy();
    await tether.waitForDeployment();

    // Deploy RWD
    const RWD = await ethers.getContractFactory("RWD");
    rwd = await RWD.connect(owner).deploy();
    await rwd.waitForDeployment();

    // Deploy ERC20 (generic token if you really need it)
    const ERC20 = await ethers.getContractFactory("ERC20");
    erc20 = await ERC20.connect(owner).deploy();
    await erc20.waitForDeployment();

    // Deploy DecentralBank WITH constructor args
    const DecentralBank = await ethers.getContractFactory("DecentralBank");
    bank = await DecentralBank.connect(owner).deploy(
      await rwd.getAddress(),
      await tether.getAddress(),
      await erc20.getAddress()
    );
    await bank.waitForDeployment();
  });

  it("deploys successfully", async function () {
    expect(await bank.name()).to.equal("Decentral Bank");
    expect(await bank.owner()).to.equal(owner.address);
  });

  it("stores correct token addresses", async function () {
    expect(await bank.rwd()).to.equal(await rwd.getAddress());
    expect(await bank.tether()).to.equal(await tether.getAddress());
    expect(await bank.erc20()).to.equal(await erc20.getAddress());
  });

  it("CHeck the balances of the owner for each Token", async () => {
    assert(await tether.balanceOf(owner) == ethers.parseEther("1000000"));
    assert(await rwd.balanceOf(owner) == ethers.parseEther("1000000"));
    assert(await erc20.balanceOf(owner) == ethers.parseEther("1000000"));
  })

  it("Allows an investor to stake tokens", async () => {
    await tether.transfer(investor, ethers.parseEther("100"));
    // Check Investor balance
    result = await tether.balanceOf(investor)
    assert(result == ethers.parseEther("100"), "Customer mock tether balance before staking");
    assert.equal(result.toString(), ethers.parseEther("100"), 'Customer mock tether balance before staking');

    // Check Staking for customer
    await tether.connect(investor).approve(await bank.getAddress(),
                                 ethers.parseEther('100'));
    await bank.connect(investor).depositTokens(ethers.parseEther('100'));

    // check updated Balance of customer
    result = await tether.balanceOf(investor);
    assert.equal(result.toString(), ethers.parseEther('0'), 'Customer mock tether balance after staking');

    // Check the updated tether balance of Decentral Bank 
    result = await tether.balanceOf(await bank.getAddress());
    assert.equal(result.toString(), ethers.parseEther('100'), 'Decentral bank mock tether balance after staking');

    // Check the staking balance of the investor
    result = await bank.stakingBalance(investor);
    assert.equal(result.toString(), ethers.parseEther('100'), 'Staking balance of the investor after staking');

    // Check the staking status of investor
    result = await bank.isStaking(investor);
    assert.equal(result.toString(), 'true', "investor's staking status after staking");

    await bank.connect(investor).unstakeTokens();
    result = await bank.stakingBalance(investor);
    assert.equal(result.toString(), ethers.parseEther('0'), 'Staking balance of the investor after unstaking');
    
    result = await tether.balanceOf(investor);
    assert.equal(result.toString(), ethers.parseEther('100'), 'Customer mock tether balance after staking');
  })
});
