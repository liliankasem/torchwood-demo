import winston = require('winston');
import fs = require('fs');

import {
    AzureBlobStorage,
    FileSystemStorage,
    IStorage,
    IIdentifier,
    EventBusGroup,
    ConsoleEventBus,
    AzureServiceBusEventBus,
    IEventBus,
    ServiceBusConfig
} from 'torchwood';

export class Helpers {
    public static async GetAllContractNames(storageConfig: any) : Promise<any> {
        const chainRoot = Helpers.FolderCheck(storageConfig);
  
        return new Promise<any>((resolve, reject) => {
            const contracts = [];
            fs.readdir(chainRoot, (error, files) => {
                if (error) {
                    winston.error(`Could not get all the files under the root dir ${chainRoot}`);
                    reject(error);
                }
                // only read the contract files
                if(files !== undefined){
                    files.forEach((file) => {
                        if (file.endsWith('.sol')) {
                            contracts.push(file);
                        }
                    });
                }

                resolve(contracts);
            });
        });
    }
    public static GetChainStorage(storageConfig: any, networkId: IIdentifier): IStorage {
        const chainRoot = `${storageConfig.root}/${networkId.AsString()}`;
        return Helpers.GetStorage(chainRoot, storageConfig);
    }

    public static GetContractStorage(storageConfig: any): IStorage {
        return Helpers.GetStorage(Helpers.FolderCheck(storageConfig), storageConfig);
    }

    public static GetStorage(storageRoot: string, storageConfig: any): IStorage {
        let storage: IStorage;

        if (storageConfig.implementation === 'FileSystem') {
            storage = new FileSystemStorage(storageRoot);
        } else {
            storage = new AzureBlobStorage(storageConfig.azure.account, storageConfig.azure.key, storageRoot);
        }

        return storage;
    }

    public static GetEventBus(serviceBusConfig: ServiceBusConfig): IEventBus {
        const eventBus = new EventBusGroup();
        eventBus.AddEventBus(new ConsoleEventBus());

        if (serviceBusConfig.IsValid()) {
            eventBus.AddEventBus(new AzureServiceBusEventBus(serviceBusConfig));
        }

        return eventBus;
    }

    public static FolderCheck(storageConfig: any): string{
        let root: string;
        if (storageConfig.contracts.implementation === 'Folder') {
            root = `${storageConfig.root}/${storageConfig.contracts.root}`;
        } else {
            root = storageConfig.contracts.root;
        }
        return root;
    }
}