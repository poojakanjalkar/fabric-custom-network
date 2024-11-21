const os = require('os');
const process = require('process');

function bytesToMB(bytes) {
  return Math.round(bytes / 1024 / 1024 * 100) / 100;
}

function getProcessMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  return {
    rss: {
      bytes: memoryUsage.rss,
      mb: bytesToMB(memoryUsage.rss)
    },
    heapTotal: {
      bytes: memoryUsage.heapTotal,
      mb: bytesToMB(memoryUsage.heapTotal)
    },
    heapUsed: {
      bytes: memoryUsage.heapUsed,
      mb: bytesToMB(memoryUsage.heapUsed)
    },
    external: {
      bytes: memoryUsage.external,
      mb: bytesToMB(memoryUsage.external)
    },
    ...(memoryUsage.arrayBuffers ? {
      arrayBuffers: {
        bytes: memoryUsage.arrayBuffers,
        mb: bytesToMB(memoryUsage.arrayBuffers)
      }
    } : {})
  };
}

function getSystemMemoryUsage() {
  return {
    total: {
      bytes: os.totalmem(),
      mb: bytesToMB(os.totalmem())
    },
    free: {
      bytes: os.freemem(),
      mb: bytesToMB(os.freemem())
    },
    used: {
      bytes: os.totalmem() - os.freemem(),
      mb: bytesToMB(os.totalmem() - os.freemem())
    }
  };
}

function getAllMemoryInfo() {
  return {
    process: getProcessMemoryUsage(),
    system: getSystemMemoryUsage(),
    cpuInfo: {
      cores: os.cpus().length,
      model: os.cpus()[0].model
    }
  };
}

function printMemoryInfo() {
  const memoryInfo = getAllMemoryInfo();
  
  console.log('=== System Memory ===');
  console.log(`Total Memory: ${memoryInfo.system.total.mb} MB`);
  console.log(`Free Memory: ${memoryInfo.system.free.mb} MB`);
  console.log(`Used Memory: ${memoryInfo.system.used.mb} MB`);
  console.log(`Memory Usage: ${Math.round(memoryInfo.system.used.mb / memoryInfo.system.total.mb * 100)}%`);
  
  console.log('\n=== Process Memory ===');
  console.log(`Resident Set Size (RSS): ${memoryInfo.process.rss.mb} MB`);
  console.log(`Heap Total: ${memoryInfo.process.heapTotal.mb} MB`);
  console.log(`Heap Used: ${memoryInfo.process.heapUsed.mb} MB`);
  console.log(`External Memory: ${memoryInfo.process.external.mb} MB`);
  
  console.log('\n=== CPU Info ===');
  console.log(`CPU Cores: ${memoryInfo.cpuInfo.cores}`);
  console.log(`CPU Model: ${memoryInfo.cpuInfo.model}`);
}

// Export functions for potential use in other modules
module.exports = {
  bytesToMB,
  getProcessMemoryUsage,
  getSystemMemoryUsage,
  getAllMemoryInfo,
  printMemoryInfo
};