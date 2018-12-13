import winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: 'info',
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: false
});

import {
    ServiceBusConfig,
    Ethereum,
    ContractFactory,
    Sha256Notary,
    IEventBus
} from 'torchwood';

import config = require('config');
import { EthereumBlockTracker } from 'torchwood/Ethereum/Ethereum';
import { Helpers } from '../util'

export class Oracle {
    public static async Run(eventBus?: IEventBus, production?: boolean) {
        // if no output event bus is specified, try to read the config
        if (eventBus === undefined) {
            eventBus = Helpers.GetEventBus(new ServiceBusConfig(config.get('eventbus')));
            if (!eventBus) {
                winston.error("No event bus provided or specified in config");
                process.exit(-1);
            }
        }
        
        if(production === undefined) {
            production = false;
        }

        await Oracle.WatchChain(config.get('rpcUrl'), config.get('startingBlock'), eventBus, production);
    }

    public static async WatchChain(rpcUrl: string, startingBlock: string, eventBusOutput: IEventBus, production: boolean) {
        const storageConfig = config.get('storage');
        const web3Client = new Ethereum.Web3.EthereumWeb3Adapter(rpcUrl);
        const networkId = await Ethereum.EthereumReader.GetIdentity(web3Client);
        const chainStorage = Helpers.GetChainStorage(storageConfig, networkId);
        const contractStorage = Helpers.GetContractStorage(storageConfig);
        const fsCache = new Ethereum.Web3.EthereumWeb3AdapterStorageCache(web3Client, chainStorage);
        const ethClient = new Ethereum.EthereumReader(fsCache, chainStorage);

        const contractFactory = new ContractFactory(web3Client, chainStorage, new Sha256Notary());

         // You may also specify a Truffle complied contract like below
         //await contractFactory.UploadTruffleCompiledJson(await contractStorage.ReadItem("contract.json"));
         await contractFactory.UploadAndVerify(await contractStorage.ReadItem("DownloadEventDemo.sol"));

        if (startingBlock.length === 0) {
            startingBlock = 'latest';
        }
        const blockNumber = (await fsCache.GetBlock(startingBlock)).number;

        // Listen to the chain and send all events to service bus
        const ethereumWatcher = new Ethereum.EthereumWatcher(ethClient, eventBusOutput, new EthereumBlockTracker(chainStorage, blockNumber));

        if (production) {
            ethereumWatcher.Monitor();
        } else {
            ethereumWatcher.ReadExistingBlocks();
        }
    }
};