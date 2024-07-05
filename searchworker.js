const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const { workerData, parentPort } = require('worker_threads');
const { dbInit } = require('./models/db');
const { findOneQuery, findAndPopulate } = require('./models/dao/commonDao');


let searchFunction = async (userName) => {
    let db = await dbInit();
    try {
        let user = await findOneQuery({ firstName: userName }, 'user')
        // console.log(user)
        if (!user) {
            parentPort.postMessage({ status: 'error', message: "User is not found" });
        }
        // user = JSON.stringify(user)
        let policies = await findAndPopulate({userId:new ObjectId(user._id)},'policyInfo')
        let result = {user,policies}
        // console.log
        parentPort.postMessage(JSON.stringify({ status: 'success', message:result}));
        db.close()
    } catch (error) {
        db.close()
        throw new Error(error)
    }
}

searchFunction(workerData)