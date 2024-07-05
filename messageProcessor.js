const cron = require('node-cron')
const { dbInit } = require('./models/db');
const { addDoc } = require('./models/dao/commonDao');

exports.insertMessage = async (body) => {
    let db = await dbInit()
    try {
        let { message, day, time } = body;
        let minutes, hour, date, month, year;
        let splitDay = day.split(/[-/]/);
        year = splitDay[0]
        month = splitDay[1]
        date = splitDay[2];
        console.log(splitDay)
        let splitTime = time.split(':')
        hour = splitTime[0]
        minutes = splitTime[1]
      
        let cronExpression = `${minutes} ${hour} ${date} ${month} *`;
        console.log('Cron expression:', cronExpression);

        cron.schedule(cronExpression, async () => {
            console.log("Cron job executed with message:", message);
            await addDoc({ message: message, day: day, time: time }, 'message');
            db.close();
        });
        return ({ message: 'Message scheduled successfully.' })
    } catch (error) {
        throw new Error(error)
    }
};
