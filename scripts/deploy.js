// scripts/deploy.js

async function main() {
   // Deploy the Tether contract
   // 1️⃣ Get contract factory
   const Tether = await ethers.getContractFactory("Tether");

    // 2️⃣ Deploy contract
    const tether = await Tether.deploy();

    // 3️⃣ Wait until deployment
    await tether.waitForDeployment();

    
    // Deploy RWD
      const RWD = await ethers.getContractFactory("RWD");
      rwd = await RWD.deploy();
      await rwd.waitForDeployment();
  
    // Deploy ERC20 (generic token if you really need it)
      const ERC20 = await ethers.getContractFactory("ERC20");
      erc20 = await ERC20.deploy();
      await erc20.waitForDeployment();
  
    // Deploy DecentralBank WITH constructor args
      const DecentralBank = await ethers.getContractFactory("DecentralBank");
      bank = await DecentralBank.deploy(
        await rwd.getAddress(),
        await tether.getAddress(),
        await erc20.getAddress()
      );
      await bank.waitForDeployment();

    // 4️⃣ Get deployed address
    const tether_address = await tether.getAddress();
    console.log("✅ Tether contract address:", tether_address);

    const rwd_address = await rwd.getAddress();
    console.log("✅ RWD contract address:", rwd_address);

    const erc20_address = await erc20.getAddress();
    console.log("✅ ERC20 contract address:", erc20_address);


    const DecentralBank_address = await bank.getAddress();
    console.log("✅ Decentral Bank contract address:", DecentralBank_address);

}

// 5️⃣ Execute script safely
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
