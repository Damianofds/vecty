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

const VECTY_BASE_WORKING_DIR = "D:\\work\\configurations\\vecty_workingdir";

// setting dependencies
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var https = require('https');
var bunyan = require('bunyan');
var timestamp = require('unix-timestamp');
var fileUpload = require('express-fileupload');
	var fs = require('fs');
	
// setting middleware functions
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.post('/vectymelo', function (req, res) {
	
	if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
	
	var mkdirp = require('mkdirp');
	const timestampnow = timestamp.now();
	var working_dir_path = VECTY_BASE_WORKING_DIR + "/tmp" + timestampnow;
	console.log("Working dir path: '" + working_dir_path + "'");
	mkdirp(working_dir_path, function(err){handleInputImg(err, req, working_dir_path, res)});
	
	
});

function handleInputImg(err, req, working_dir_path, res) {
	if (err){
		console.error(err);
	}
	else{
		console.log('Potrace working directory created!');
		
		var srcImg = req.files.srcImg;
		srcImg.mv(working_dir_path + '/srcImg.jpg', function(err){makeVectorDraw(err, working_dir_path, res)});
	}
}

function makeVectorDraw(err, working_dir_path, res) {
	if (err) {
		res.status(500).send(err);
	}
	else {
			
		const exec = require('child_process').execFile;
		const ls = exec('D:/work/code/vecty/script.bat', [working_dir_path + '/srcImg.jpg', working_dir_path]); //, ['-h', '/usr']

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
				//console.log('received data: ' + data);
				var GitHubApi = require("github");
				var github = new GitHubApi({
					//debug: true,
					protocol: "https",
					host: "api.github.com",
					headers: {
						"user-agent": "Vecty"
					},
					Promise: require('bluebird'),
					followRedirects: false,
					timeout: 5000
				});
				
				// OAuth2
				github.authenticate({
					type: "oauth",
					token: "5b12ba4d2e35c9e298d544f09e71542a832e8be1"
				});
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
			}
		});
	}else{
		console.log(err);
	}
}


function returnView(err, fileToCommit, res) {
	console.log(err, res);
	if(!err){
		res.send("---"+res);
		console.log("...'" + fileToCommit + "' PUSHED!");
	}
	else{
		console.log("...'" + fileToCommit + "' NOT PUSHED :( A fukkin error happened!");
	}
}


var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Vecty is listening at http://%s:%s', host, port);
});