/**
 * Notes on API
 * 1. use nouns in endpoint paths
 * 2. name collections with plural nouns
 * 3. nesting resources for hierarchical objects
 * 4. handle errors gracefully and return standard error codes
 * 5. allow filtering, sorting, and pagination
 * 6. cache data to improve performance
 */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 6.
// an example of a in-memory cache. An alternative: redis
const apicache = require('apicache');
let cache = apicache.middleware;
app.use(cache('5 minutes'));

app.get('/validators', (req, res) => {
    const validators = [];
    // code to retrieve an validators...
    res.json(validators);
});

app.post('/validators', (req, res) => {
    // code to add a new validators...
    res.json(req.body);
});

app.put('/validators/:id', (req, res) => {
    const { id } = req.params;
    // code to update an validators...
    res.json(req.body);
});

app.delete('/validators/:id', (req, res) => {
    const { id } = req.params;
    // code to delete an validators...
    res.json({ deleted: id });
});

// 3.
app.get('/validators/:validatorId/comments', (req, res) => {
    const { validatorId } = req.params;
    const comments = [];
    // code to get comments by validatorId
    res.json(comments);
});

// 4.
const users = [
    { email: 'abc@foo.com' }
]
app.post('/users', (req, res) => {
    const { email } = req.body;
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ error: 'User already exists' })
    }
    res.json(req.body);
});

// 5.
const delegation = [
    { address: 'cosmos11', validator: 'cosmosvaloper1', amount: 10 },
    { address: 'cosmos12', validator: 'cosmosvaloper1', amount: 20 },
    { address: 'cosmos13', validator: 'cosmosvaloper2', amount: 30 },
]

app.get('/delegation', (req, res) => {
    const { address, validator, amount } = req.query;
    let results = [...delegation];
    if (address) {
        results = results.filter(r => r.address === address);
    }

    if (validator) {
        results = results.filter(r => r.validator === validator);
    }

    if (amount) {
        results = results.filter(r => +r.amount === +amount);
    }
    res.json(results);
});

app.listen(3000, () => console.log('server started'));

/*
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
*/
