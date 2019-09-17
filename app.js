/**
Copyright 2016 - fds
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const VECTY_BASE_WORKING_DIR = "/tmp";

const VECTY_EXECUTIONS_DIR = VECTY_BASE_WORKING_DIR + "/vecty-workidr";

const VECTY_CERT_DIR = VECTY_BASE_WORKING_DIR + "/certs"
const VECTY_CERT = VECTY_CERT_DIR + "/hacksparrow-cert.pem";
const VECTY_CERT_KEY = VECTY_CERT_DIR + "/hacksparrow-key.pem";

const VECTY_SCRIPTS_DIR = ""
const VECTY_SCRIPTS_POTRACEIT = VECTY_SCRIPTS_DIR + "./potraceit.sh"


// setting dependencies
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var http = require('http');
var bunyan = require('bunyan');
var timestamp = require('unix-timestamp');
var fileUpload = require('express-fileupload');
var fs = require('fs');
	
// setting middleware functions
var app = express();
app.use(express.static('public'));
app.use(bodyParser());
app.use(fileUpload());

app.post('/vectymelo', function (req, res) {
	
	if (!req.files && !req.body.thePic) {
        res.send('No files were uploaded.');
		console.info("...ERROR, NO FILE SENT !!!");
		res.status(400).send(err);
    }
	else{
		console.info("...at least one file was sent...");
	}
	
	var mkdirp = require('mkdirp');
	const timestampnow = timestamp.now();
	var working_dir_path = VECTY_EXECUTIONS_DIR + "/tmp" + timestampnow;
	console.log("...working dir path: '" + working_dir_path + "'...");
	mkdirp(working_dir_path, function(err){
		handleInputImg(err, req, working_dir_path, res)
	});
	return;
});

function handleInputImg(err, req, working_dir_path, res) {
	if (err){
		console.error(err);
	}
	else{
		console.log('...potrace working directory created!');
		
		if (req.files) {
			var srcImg = req.files.srcImg;
			srcImg.mv(working_dir_path + '/srcImg.jpg', function(err){makeVectorDraw(err, working_dir_path, res)});
		}
		else if(req.body.thePic){
			
			console.info("FUCK YEAH");
			
			var base64Data = req.body.thePic.replace(/^data:image\/png;base64,/, "");
			fs.writeFile(working_dir_path + '/srcImg.jpg', base64Data, 'base64', function(err){makeVectorDraw(err, working_dir_path, res)});
		}
		else{
			res.status(400).send(err);
		}
		
	}
}

function makeVectorDraw(err, working_dir_path, res) {
	if (err) {
		res.status(500).send(err);
	}
	else {
		console.log("...making vector representation...");
		const exec = require('child_process').execFile;
		var srcImg = working_dir_path + '/srcImg.jpg'
		console.log("...file to transform is " + srcImg + "...");
		const ls = exec(VECTY_SCRIPTS_POTRACEIT, [srcImg, working_dir_path]); //, ['-h', '/usr']

		ls.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		ls.stderr.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});
		
		ls.on('close', (code) => {
			console.log(`child process exited with code ${code}`);
			openVectorDraw(working_dir_path, res);
		});
	}
}

function openVectorDraw(working_dir_path, res){
	//TODO sooner or later this file must also be closed...
	fs.open(working_dir_path+"/outBase64", 'r', function (err, fileToRead){saveVectorDraw(err, fileToRead, working_dir_path, res)});
}

function saveVectorDraw(err, fileToRead, working_dir_path, res){
	if (!err){
		fs.readFile(working_dir_path+"/outBase64", {encoding: 'utf-8'}, function(err,data){
			if (!err){
				console.log('received data: ' + "---data");
				var GitHubApi = require("github");
				var github = new GitHubApi({
					debug: false,
					protocol: "https",
					host: "api.github.com",
					headers: {
						"user-agent": "Vecty"
					},
					Promise: require('bluebird'),
					followRedirects: false,
					timeout: 5000
				});
				console.log("GitHubApi obj instantiated!");
				// OAuth2
				github.authenticate({
					type: "oauth",
					token: "cb9f3e22a772986a4d842a8f4286f7f423f6aef3"
				});
				console.log("Authentication using the GitHubApi obj done!");
				var timestampnow = working_dir_path.match(/[0-9]{1,10}\.[0-9]{1,10}/);
				const fileToCommit = "coolness"+timestampnow+".svg";
				console.log("Going to push '" + fileToCommit + "' the file on github...");
				github.repos.createFile({
					user: "f-ds",
					repo: "vecty-data",
					path: fileToCommit,
					message: "a cool commit",
					content: data,
				}, function(err){returnView(err, fileToCommit, res)});
			}else{
				console.log(err);
				res.status(500).send(err);
			}
		});
	}else{
		console.log(err);
		res.status(500).send(err);
	}
}


function returnView(err, fileToCommit, res) {
	//console.log(err, res);
	if(!err){
		console.log("...'" + fileToCommit + "' PUSHED!");
		res.status(500).send(err);
	}
	else{
		console.log("...'" + fileToCommit + "' NOT PUSHED :( A fukkin error happened! reason is: '" + res + "'");
		res.status(500).send(err);
	}
}


//HTTPS server -> http://www.hacksparrow.com/node-js-https-ssl-certificate.html

//var hscert = fs.readFileSync(VECTY_CERT);
//var hskey = fs.readFileSync(VECTY_CERT_KEY);
//
//var options = {
//    key: hskey,
//    cert: hscert
//};

//http.createServer(app).listen(80);
//https.createServer(options, app).listen(443);


var server = app.listen(8000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Vecty is listening at http://%s:%s', host, port);
});