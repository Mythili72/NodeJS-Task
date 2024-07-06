API
POST - http://localhost:4500/uploadExcel
GET - http://localhost:4500/search?userName
GET - http://localhost:4500/aggregate
POST - http://localhost:4500/message


pm2 start index.js --name insuredMine
pm2 start monitor.js --name cpu_monitor
