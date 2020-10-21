# Example of onchain smart contract wallet generation that is not deployed until needed.

* zkSync branch: https://github.com/matter-labs/zksync/tree/create2-deployment
* deployed to: https://ropsten-beta.zkscan.io/
* zksync.js: 0.8.2-beta


1. Set `ETH_PRIVATE_KEY` env variable to private key of the account with ropsten ethereum.
2. Run `yarn run-example` to run `index.js` script that.
    * Generates wallet for `contract/Counter.sol` contract with custom salt arguments and deployer deployed at address stored in `factoryAddress.json`
    * Deposits ETH to this account 
    * Sets signing key for this account
    * Makes transfer to check if account is unlocked
3. To deploy contract using CREATE2 run `yarn deploy-with-create2 $SALT` where `$SALT` is salt that was printed on step 2
