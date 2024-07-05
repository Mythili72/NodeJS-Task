const { parentPort, workerData, worker } = require('worker_threads');
const { dbInit } = require('./models/db');
const { aggregateQuery } = require('./models/dao/commonDao');


let aggregateFunction = async () => {
    let db = await dbInit();
    try {
        let policies = await aggregateQuery('policyInfo',)
        parentPort.postMessage(JSON.stringify({ status: 'success', message: policies }));
        db.close()
    } catch (error) {
        db.close()
        throw new Error(error)
    }
}

aggregateFunction(workerData)