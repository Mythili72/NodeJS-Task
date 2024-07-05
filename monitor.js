// monitor.js

const os = require('os');
const { exec } = require('child_process');

const checkCPUUsage = () => {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      total += cpu.times[type];
    }
    idle += cpu.times.idle;
  });

  const usage = (1 - idle / total) * 100;
  if (usage > 70) {
    exec('pm2 restart all', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error restarting server: ${err.message}`);
      } else {
        console.log('Server restarted due to high CPU usage');
      }
    });
  }
};

setInterval(checkCPUUsage, 5000);
