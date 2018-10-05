const { exec } = require('child_process');
const app = polka();  // Same as Express.js but might be faster.


// Template for sending commands to shell.
function cmd(endpoint) {
  exec(`curl localhost:25567/${endpoint}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr !== '') {
      console.error(`stderr: ${stderr}`);
      return;
    }

    return stdout;

  });
}


// Do the "Transform" step in Extract, Transform, Load (ETL) here later.
function status() {
  cmd('status');
}

function netInfo() {
  cmd('net_info');
}

function consensusState() {
  cmd('consensus_state');
}


// "Load" step to spit the transformed data out to the web app.
app.get('/status', (req, res) => {
  res.end(status());
});

app.get('/net_info', (req, res) => {
  res.end(netInfo());
});

app.get('/consensus_state', (req, res) => {
  res.end(consensusState());
});
