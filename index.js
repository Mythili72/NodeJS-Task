const http = require('http');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const url = require('url');
const { Worker } = require('worker_threads');
const querystring = require('querystring');
const { insertMessage } = require('./messageProcessor');

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname);
    if (extension === '.csv') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


// Initialize multer with storage and file filter configuration
const upload = multer({ storage: storage, fileFilter: fileFilter }).single('file');

let app = http.createServer(async (req, res) => {

    let parsedUrl = url.parse(req.url);
    let urlPath = parsedUrl.pathname;
    // console.log(urlPath);
    if (urlPath == '/uploadExcel' && req.method == "POST") {
        upload(req, res, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error uploading file', err);
                return;
            }
            // console.log(req.file)
            if (!req.file) {
                res.writeHead(406, { 'Content-Type': 'text/plain' });
                res.end('File is missing and check whether it is in csv file format');
                return;
            }
            const filePath = path.join(__dirname, './', req.file.path);
            // console.log("filePath",filePath)
            const worker = new Worker('./uploadWorker.js', {
                workerData: filePath
            })

            worker.on('message', (msg) => {
                console.log(msg)
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(msg.message);
                return;
            });

            worker.on('error', (error) => {
                console.log(error)
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(error);
                return;
            })
        })
    } else if (urlPath == '/search' && req.method == "GET") {
        let queryParams = querystring.parse(parsedUrl.query);
        // console.log(queryParams);
        if (!queryParams.userName) {
            res.writeHead(406, { 'Content-Type': 'text/plain' });
            res.end('Please send user name to find policy info');
            return;
        } else {
            const worker = new Worker('./searchWorker.js', {
                workerData: queryParams.userName
            })

            worker.on('message', (msg) => {
                let result = JSON.parse(msg)
                // console.log(result.message)
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result.message));
                return;
            });

            worker.on('error', (error) => {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(error.toString());
                return;
            })
        }
    } else if (urlPath == '/aggregate' && req.method == "GET") {
        const worker = new Worker('./aggregateWorker.js', { workerData: [] })
        worker.on('message', (msg) => {
            // console.log(msg)
            let result = JSON.parse(msg)
            // console.log(result.message)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.message));
            return;
        });

        worker.on('error', (error) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(error.toString());
            return;
        })
    } else if (urlPath == '/message' && req.method == "POST") {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end',async () => {
            try {
                let messageData = JSON.parse(body);
                console.log(messageData)
                await insertMessage(messageData);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("Message scheduled successfully.");
                return;
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON');
            }
        });

        req.on('error', (error) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(error.toString());
        });
    }

})

app.listen(4500, () => {
    console.log(`Server is running on port 4500`);
});