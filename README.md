# torchwood-demo

Before running these projects, have a chain instance running (e.g. `ganache-cli`)

## Running the truffle project

1. `git clone https://github.com/liliankasem/torchwood-demo.git`
2. `cd torchwood-demo/truffle`
3. Update the `truffle.js` network with your chain instance
    - e.g.  `http://127.0.0.1:8545`
4. `truffle compile`
5. `truffle test`

## Running the oracle project

1. `git clone https://github.com/liliankasem/torchwood-demo.git`
2. `cd torchwood-demo/oracle`
3. `npm i`
4. Inside `config/default.json`, update rpcUrl to your chain instance
    - e.g.  `http://127.0.0.1:8545`
5. `npm run build`
6. `npm run oracle`