# Torchwood Oracle Demo

Before running these projects, have a chain instance running (e.g. `ganache-cli`)

I run this command as there is a specific account I use in this demo to deploy contracts (using torchwood):

`ganache-cli --account="0xccd014cf522775cad265a110befeb383afc43dec1d7d66ccf1696e5b96c1c5c7,1000000000000000000000000000000000000000"`

## Running this project

1. `git clone https://github.com/liliankasem/torchwood-oracle.git`
2. `npm i`
3. Inside `config/default.json`, update rpcUrl to your chain instance
    - e.g.  `http://127.0.0.1:8545`
4. `npm run build`
5. `npm run contracts` - this will deploy the Flag.sol contract on to the chain

``` LOG
warn: log level set to info
debug: Compiling 14274a7e818b648d0c55db85e7a71445c48cdbc48925899c669e031ae7364215
debug: Persisting contract Flag
debug: Submitting transaction
debug: 0x9c8a5eb37dba8e46ec20981257bc9f18ee3ee567a905bf4816a6c2c8063e7086
debug: Waiting for transaction to be mined
debug: 0xd852549950bef777271ba7123f62224e5adcc58f
```

6. `npm run oracle` - this will run the oracle listening to that chain

``` LOG
warn: log level set to info
debug: Compiling 14274a7e818b648d0c55db85e7a71445c48cdbc48925899c669e031ae7364215
debug: Persisting contract Flag
info: Local File System './demo/1541798657619-98ed9cc348'
info: Console Event Bus
debug: Reading Block 0
info: {"_block":1,"_address":"0x30ab3d9f876005ed7f351b7cd7330b90136deb92","_balance":"1000000000000000000000","_events":{}}
info: {"_state":"0","_block":1,"_address":"0xd852549950bef777271ba7123f62224e5adcc58f","_balance":"0","_events":[]}
```

## Important Info

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

``` javascript
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

### Truffle
You can also use this sample truffle project to deploy contracts onto the chain:

https://github.com/liliankasem/truffle

#### Getting Torchwood to read contracts not compiled with Torchwood
Torchwood uses the default solcjs settings when compiling, this is equivalent of running solc --optimize which should compile and optimize the contract for 200 runs. If you compiled and deployed the contract using Truffle or another testing framework, make sure that it is compiling the contracts with the optimizer enabled.

#### Enabling optimizer for Truffle
By default Truffle does not have the optimizer enabled when compiled contracts. To enable the optimizer you must open your truffle.js or truffle-config.js file and adjust your module.exports object to look like the following:

```
module.exports = {
  solc: { 
    optimizer: { 
      enabled: true, // Enable solc optimizer
    },
  }
};
```