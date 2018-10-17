# torchwood-demo

Before running these projects, have a chain instance running (e.g. `ganache-cli`)

## Running the truffle project

The following will deploy a `Flag` contract onto the chain, it will also change the state of the flag from open (0) to closed (1).

1. `git clone https://github.com/liliankasem/torchwood-demo.git`
2. `cd torchwood-demo/truffle`
3. Update the `truffle.js` network with your chain instance
    - e.g.  `http://127.0.0.1:8545`
4. `truffle compile`
5. `truffle test`

## Running the Oracle project

1. `git clone https://github.com/liliankasem/torchwood-demo.git`
2. `cd torchwood-demo/oracle`
3. `npm i`
4. Inside `config/default.json`, update rpcUrl to your chain instance
    - e.g.  `http://127.0.0.1:8545`
5. `npm run build`
6. `npm run oracle`

If you don't see any details about specific changes of a contract, it's probably because the hashes of the contracts are different (i.e. truffle's solc compiler is different to the solc version that Torchwood uses). In that case:

1. Stop the oracle
2. Reset block value in `watcherConfig.json` block back to 0
3. Copy the `abi.json` file (from the folder in `demo/chainid/Code` that contains it) into the other hash folders inside the `Code` folder
4. Run the oracle again `npm run oracle`