const ethers = require("ethers");
const zksync = require("zksync");

const crypto = require("crypto");

async function createDepositWallet() {
    const ethProvider = new ethers.providers.getDefaultProvider("ropsten");
    const ethSigner = new ethers.Wallet(process.env.ETH_PRIVATE_KEY).connect(ethProvider);
    const zksyncProvider = await zksync.getDefaultProvider("ropsten-beta")
    return zksync.wallet.Wallet.fromEthSigner(ethSigner, zksyncProvider);
}

async function main() {
    // Generate zkSync private key
    const privateKeySeed = crypto.randomBytes(32);
    const signer = zksync.Signer.fromSeed(privateKeySeed);

    // arbitrary arguments encoded in the address
    const saltArg = ethers.utils.keccak256(Buffer.from("additional arguments example", "utf-8"));

    // address of the deployer contract
    const creatorAddress = require("./factoryAddress.json").factoryAddress;

    // contract code
    const codeHash = ethers.utils.keccak256(require("./artifacts/Counter.json").bytecode);

    const create2Auth = {
        creatorAddress,
        codeHash,
        saltArg,
    };

    const zksyncProvider = await zksync.getDefaultProvider("ropsten-beta")
    const ethSigner = new zksync.create2wallet.Create2WalletSigner(signer.pubKeyHash(), create2Auth);
    console.log("Generated new account");
    console.log("address:",ethSigner.address);
    console.log("salt:",ethSigner.salt);

    const zksWallet = await zksync.wallet.Wallet.fromEthSigner(ethSigner, zksyncProvider, signer, null, { verificationMethod: "ERC-1271", isSignedMsgPrefixed: true});

    console.log("Depositing to new account");
    const depositWallet = await createDepositWallet();
    const depositHandle = await depositWallet.depositToSyncFromEthereum({
        depositTo: zksWallet.address(),
        token: "ETH",
        amount: zksyncProvider.tokenSet.parseToken("ETH", "0.002"),
        approveDepositAmountForERC20: true
    });
    await depositHandle.awaitReceipt();

    console.log("Setting ChangePubkey for Create2Walelt");
    const chpk = await zksWallet.setSigningKey({
        feeToken: "ETH",
        changePubkeyType: "Create2Contract"
    });
    await chpk.awaitReceipt();

    console.log("Making transfer");
    const transfer = await zksWallet.syncTransfer({
        to: zksWallet.address(),
        token: "ETH",
        amount: 1
    })
    await transfer.awaitReceipt();

    console.log("Done");
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error("Error: ",e);
        process.exit(1)
    })
