import { assert } from 'chai';
import Mocha = require('mocha');

import { ContractDeployer } from '../util'
import { IEventBus } from 'torchwood/interfaces/IEventBus';
import { Oracle } from '../src/oracle';
import winston = require('winston');

class DownloadEventVerifierEventBus implements IEventBus {
    private readonly identifier: string;
    private eventDetected: boolean;

    constructor() {
        this.identifier = "Test event bus for verifying download events";
        this.eventDetected = false;
    }

    public Identifier(): string {
        return this.identifier;
    }

    public SendEvent(content: any): Promise<void> {
        if(JSON.stringify(content).includes("DownloadRequestEvent")) {
            this.eventDetected = true;
        }
        return new Promise<void>(resolve => resolve());
    }

    public IsEventDetected() : boolean {
        return this.eventDetected;
    }
};

Mocha.describe('Oracle event reading E2E test', function() {
    // the default timeout is 2 seconds which isn't long enough
    // for contract deployment and Oracle watcher
    this.timeout(15000);

    // create a testing event bus to verify the output from the Oracle
    const testingEventBus = new DownloadEventVerifierEventBus();
    
    Mocha.before( function(done) {
        const contractdeployer = new ContractDeployer();
        contractdeployer.DeployContractsInConfig().then(function() { 
            Oracle.Run(testingEventBus, false).then( function() {
                done();
            });
        });
     });

     Mocha.it('should verify event was fired', function (done) {
        setTimeout(function() { 
            const result = testingEventBus.IsEventDetected();
            assert(result, "Event was not detected..");
            done();
         }, 3000);
     });
  });