# zkSync Create2 example

Example of onchain smart contract wallet generation that is not deployed until needed.


## Demo steps

1. Create a `.env` file and set 2 environment variables:

```
ETH_PRIVATE_KEY=0x020......... (Make sure it's prefixed with 0x)

INFURA_ID=25...........
```

* `ETH_PRIVATE_KEY` env variable to private key of the account with ropsten ethereum.
* `INFURA_ID` the Project ID of an eth project: from [Infura](https://infura.io/dashboard/ethereum)

2. Run:

```sh
$ yarn install
$ yarn run-example
```

Which runs `index.js` that:

* Generates wallet for `contract/Counter.sol` contract with custom salt arguments and deployer deployed at address stored in `factoryAddress.json`
* Deposits ETH to this account
* Sets signing key for this account
* Makes transfer to check if account is unlocked

3. To deploy contract using CREATE2 run:

```sh
$ yarn deploy-with-create2 $SALT
```

where `$SALT` is salt that was printed on step 2


## Built with

* zkSync branch: https://github.com/matter-labs/zksync/tree/create2-deployment
* deployed to: https://ropsten-beta.zkscan.io/
* zksync.js: 0.8.2-beta
