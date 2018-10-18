# torchwood-demo

Before running these projects, have a chain instance running (e.g. `ganache-cli`)

I run this command as that is the account I have using to deploy contracts onto the chain using torchwood:

`ganache-cli --account="0xccd014cf522775cad265a110befeb383afc43dec1d7d66ccf1696e5b96c1c5c7,1000000000000000000000000000000000000000"`

## Running this project

1. `git clone https://github.com/liliankasem/torchwood-demo.git`
2. `npm i`
3. Inside `config/default.json`, update rpcUrl to your chain instance
    - e.g.  `http://127.0.0.1:8545`
4. `npm run build`
5. `npm run contracts` - this will deploy the Flag.sol contract on to the chain
6. `npm run oracle` - this will run the oracle listening to that chain

If you don't see any details about specific changes of a contract, it's probably because the hashes of the contracts are different (i.e. truffle's solc compiler is different to the solc version that Torchwood uses). In that case:

1. Stop the oracle
2. Reset block value in `watcherConfig.json` block back to 0
3. Copy the `abi.json` file (from the folder in `demo/chainid/Code` that contains it) into the other hash folders inside the `Code` folder
4. Run the oracle again `npm run oracle`

## Other

In your storage location, you need a `Contracts` folder that will contain the .sol files for the contracts you want to listen to on the chain.

In this demo, the root of my storage is inside the 'demo' folder (as specified in the config file):

``` json
    "storage": {
        "implementation": "FileSystem",
        "root": "./demo",
        "azure": {
            "account": "",
            "key": ""
        }
    },
```

### If using Torchwood to make transactions

In your storage location, you need a 'keystore' folder containing the keystore file for the account you want to use to make transactions on the chain;  `storage_root/keystore/account.json` i.e. `demo/keystore/0x30ab3d9f876005ed7f351b7cd7330b90136deb92.json`

You need to update the `config.default.json` file accordingly:

``` json
    "setup" : {
        "account": "0x30ab3d9f876005ed7f351b7cd7330b90136deb92", //account you want to use to make transactions
        "secret" : "helloworld", //secret of that account
        "contract": {
            "file": "Contracts/Flag.sol", //location, from storage root, of where to find the contract .sol
            "name": "Flag",
            "parameters": {
            }
        }
    }
```