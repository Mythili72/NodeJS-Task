const xlsx = require('xlsx');
const fs = require('fs')
const { workerData, parentPort } = require('worker_threads');
const moment = require('moment');
const { dbInit } = require('./models/db');
const { addDoc } = require('./models/dao/commonDao');

let dateFormat = (seconds) => {
    const utc_days = Math.floor(seconds - 25569);
    const date = moment.utc(utc_days * 86400 * 1000).format("YYYY-MM-DD");
    return date;
};

let workerFunction = async (filePath) => {
    let db = await dbInit();
    try {
        console.time("File upload")
        // console.log(filePath, workerData)
        let workbook = xlsx.readFile(filePath);
        let sheetName = workbook.SheetNames[0];
        let sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        for (let row of sheet) {
            // console.log(row)
            //Add Agent
            await addDoc({ agentName: row.agent }, 'agent');

            //Add User
            let user = await addDoc({
                firstName: row.firstname,
                dob: new Date(dateFormat(row.dob)),
                address: row.address,
                phone: row.phone,
                state: row.state,
                zip: row.zip,
                email: row.email,
                gender: row.gender,
                userType: row.userType,
            }, 'user');

            //Add User's Account
            await addDoc({ accountName: row.account_name }, 'account');

            //Add Policy Category
            // console.log(row.category_name)
            let policyCategory = await addDoc({ categoryName: row.category_name }, 'policyCategory');
            // console.log("policyCategory",policyCategory,new Date(dateFormat(row.policy_start_date)))

            //Add Policy Carrier
            let policyCarrier = await addDoc({ companyName: row.company_name }, 'policyCarrier');

            //Add Policy Info
            await addDoc({
                policyNumber: row.policy_number,
                policyStartDate: new Date(dateFormat(row.policy_start_date)),
                policyEndDate: new Date(dateFormat(row.policy_end_date)),
                policyCategory: policyCategory._id,
                policyCarrier: policyCarrier._id,
                userId: user._id,
            }, 'policyInfo')
        }
        fs.unlinkSync(filePath);
        parentPort.postMessage({ status: 'success', message: 'Data uploaded successfully' });

        db.close();
        console.timeEnd("File upload")

    } catch (error) {
        db.close();
        throw new Error(error)
    }
}
// parentPort.postMessage('Hello world!');
workerFunction(workerData)