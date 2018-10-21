/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START gae_node_request_example]
const express = require('express');
const myParser = require('body-parser')

const app = express();

var latest_notice = "No notice yet"

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use("/static",express.static(__dirname + "/static"));

app.use(myParser.json());

app.post("/", function(request, response) {
	latest_notice=request.body.notice
	console.log(request.body); //This prints the JSON document received (if it is a JSON document)
	response.end("Ack")
});

app.get('/', (req, res) => {
  res.render('index', {notice: latest_notice});
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]