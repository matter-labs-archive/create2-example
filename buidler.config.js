const fs = require("fs");

usePlugin("@nomiclabs/buidler-waffle");

task("deploy-create2", "Deploys contract with the given salt")
    .addParam("salt", "CREATE2 salt argument")
    .setAction(async (args) => {
        const factoryAddress = JSON.parse(fs.readFileSync("factoryAddress.json")).factoryAddress;
        const deployerFactory = await ethers.getContractFactory("Deployer");
        const deployer = await deployerFactory.attach(factoryAddress);
        const tx = await deployer.deployCreate2(args.salt);
        const receipt = await tx.wait();
        console.log("deployed address:", receipt.events[0].args);
    });

task("create-deploy-factory", "Deploys create2 deployer")
    .setAction(async () => {
        const deployerFactory = await ethers.getContractFactory("Deployer");
        const deployer = await deployerFactory.deploy();
        await deployer.deployed();
        fs.writeFileSync("factoryAddress.json",JSON.stringify({ factoryAddress: deployer.address }));
    });

module.exports = {
  defaultNetwork: "ropsten",
  networks: {
    ropsten: {
        url: "https://ropsten.infura.io/v3/84842078b09946638c03157f83405213",
        accounts: [process.env.ETH_PRIVATE_KEY],
    }
  },
  solc: {
    version: "0.6.8",
  },
};
