import winston = require('winston');
import config = require('config');

import {
    Sha256Notary,
    SigningNotary,
    LoggingConfiguration, 
    ContractFactory, 
    ISigningNotary, 
    IStorage
} from 'torchwood';

import { IWeb3Adapter, Ethereum } from 'torchwood/Ethereum';
import { EthereumAddress } from 'torchwood/Ethereum/models';
import { Helpers } from '.'

const EthereumWeb3Adapter = Ethereum.Web3.EthereumWeb3Adapter;

export class ContractDeployer {
    private readonly web3: IWeb3Adapter;
    private readonly factory: ContractFactory;
    private readonly storage: IStorage;

    constructor() {
        LoggingConfiguration.initialize(null);
        const storageConfig = config.get('storage');
        const rpcUrl = config.get('rpcUrl');
        this.storage = Helpers.GetStorage(storageConfig.root, storageConfig);
        const notary = new Sha256Notary();
        this.web3 = new EthereumWeb3Adapter(rpcUrl);
        this.factory = new ContractFactory(this.web3, this.storage, notary);
    }

    public async DeployContractsInConfig() {
        const setupConfig = config.get('setup');
        const storageConfig = config.get('storage');
        const signer = new SigningNotary(this.storage, setupConfig.secret);
        const contractStorage: IStorage = Helpers.GetContractStorage(storageConfig);

        // ensure the specified contract exists
        const contractFilenames = await Helpers.GetAllContractNames(storageConfig);
        let contractFound : boolean = false;
        contractFilenames.forEach(async function(filename) {
            if (filename === setupConfig.contract.name.concat('.sol')) {
                contractFound = true;
            }
        });

        if(!contractFound) {
            const msg = `${setupConfig.contract.name} not found in ${storageConfig.contracts.root} folder`; 
            winston.error(msg);
            process.exit(-1);
        }

        const rawContract = (await contractStorage.ReadItem(setupConfig.contract.name.concat('.sol')));
        await this.DeployContract(rawContract, setupConfig.contract.name, setupConfig.contract.parameters, setupConfig.account, signer);
    }

    private async DeployContract(rawContract: string, contractName: string, contractParams: any, account: string, signer: ISigningNotary) {
        const fromAddress = new EthereumAddress(account);
        const id = await this.factory.UploadAndVerify(rawContract);
        const constructor = null;
        const prepared = await this.factory.PrepareTransaction(fromAddress, id, contractName, constructor, contractParams);
        const signed = await signer.Sign(prepared);
        const receipt = await this.web3.SendSignedTx(signed);
        await this.web3.WaitForTx(receipt);
    }
}