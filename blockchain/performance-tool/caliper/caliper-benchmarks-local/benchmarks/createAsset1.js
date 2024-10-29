'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');
const { v1: uuidv4 } = require('uuid')

let assetIdArray = [];
/**
 * Workload module for the benchmark round.
 */
class CreateDeviceWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        let id = uuidv4()
        assetIdArray.push(id)

        let assetData = {
            id: id,
            Color: "White",
            Size: "Large",
            Owner: "Pavan",
            AppraisedValue: "2000000",
        };


        let args = {
            contractId: 'chaincode1',
            contractVersion: 'v1',
            contractFunction: 'CreateAsset',
            contractArguments: [JSON.stringify(assetData)],
            timeout: 30
        };

        await this.sutAdapter.sendRequests(args);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new CreateDeviceWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
module.exports.assetIdArray = assetIdArray;
