const mongoose = require('mongoose');
const file = require("./dto/index")
let dbInit = async () => {
    try {
        let db = mongoose.connection;

        mongoose.connect("mongodb://localhost:27017/insureMind",{ useUnifiedTopology: true });
        let retryConnection = setInterval(() => {
            mongoose.connect("mongodb://localhost:27017/insureMind", { useUnifiedTopology: true });
        }, 5000);
        // console.log(db)
        db.on("open", async () => {
            clearInterval(retryConnection);
            console.log("Database connected!!");
        });

        db.on('error', async (error) => {
            console.log("Connection failed...", error);
        });

        db.on('disconnected', () => {
            console.log('Mongoose disconnected from MongoDB');
        });

        return db;
    } catch (error) {
        console.log(error);
        setTimeout(() => {
            dbInit();
        }, 2000);
    }
};

module.exports = { dbInit };
