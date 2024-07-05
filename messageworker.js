const { parentPort, workerData } = require('worker_threads');
const { dbInit } = require('./models/db');
const { addDoc } = require('./models/dao/commonDao');

const insertMessage = async (body) => {
    let db = await dbInit()
    try {
        let {message, day, time} = body;
        let dateTime = new Date(`${day} ${time}`)
        console.log(dateTime)
        await addDoc({ message: message, dateTime:dateTime }, 'message');
        parentPort.postMessage({ status: 'success', message: 'Message inserted successfully' });

        db.close();
    } catch (error) {
        throw new Error(error)
    }
};

insertMessage(workerData);
