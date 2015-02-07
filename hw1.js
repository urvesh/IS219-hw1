var http = require('http'),
	events = require('events'),
	fs = require('fs'),
	eventEmitter = new events.EventEmitter();

http.createServer(function (request, response) {

	request.on('end', function () {
		getUserAgent(request);
	});

	response.writeHead(200, {'Content-Type': 'text/plain'});	
	response.end();
}).listen(8080);

function getUserAgent(request) {
	var userAgent = request.headers['user-agent'];
	eventEmitter.emit('gotUserAgent', userAgent);
}

eventEmitter.on('gotUserAgent', function (userAgent) {
	writeToCSV(userAgent);
});

function writeToCSV (data) {
	var today = new Date(),
		filename = 'useragent.csv';
	
	fs.exists(filename, function (exists) {
		if (!exists) {
			fs.writeFile(filename, 'timestamp, user-agent\n');
		}
		fs.appendFile(filename, today + ',' + data.replace(/,/g, '') + '\n');	
	})
}



