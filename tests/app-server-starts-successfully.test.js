const assert = require('assert');
const { exec } = require('child_process');
const path = require('path');

// Path to the server executable (replace with your actual path)
const serverExecutable = path.join(__dirname, '..', 'server.js');

// Function to start the server and return a promise
const startServer = () => {
  return new Promise((resolve, reject) => {
    const serverProcess = exec(`node ${serverExecutable}`);

    // Set a timeout to consider the server started
    const timeoutId = setTimeout(() => {
      resolve(serverProcess);
    }, 2000); // Adjust timeout as needed

    serverProcess.stderr.on('data', (data) => {
      clearTimeout(timeoutId);
      reject(new Error(`Server error: ${data}`));
    });
  });
};

describe('Server Startup', () => {
  it('Should start the server without errors', async () => {
    try {
      const serverProcess = await startServer();

      // Optional: Add assertions to check if the server is listening on the correct port, etc.
      // For example, use net.connect to attempt a connection after a brief delay.

      // Clean up the server process after the test
      serverProcess.kill();

    } catch (error) {
      assert.fail(`Server failed to start: ${error.message}`);
    }
  }).timeout(5000); // Set a timeout for the test
});