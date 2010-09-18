
/**
 * Module dependencies.
 */

var http = require('http'),
    io = require('socket.io'),
    fs = require('fs'),
    sys = require('sys'),
    dmp = require('./google-diff-match-patch').diff_match_patch;

var $dmp = new dmp();

console.log(sys.inspect($dmp.__proto__));

var server = http.createServer(function(req,res) {
  fs.readFile('./public/index.html', function(err, data) {
    if(err) throw err;

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
});

// Only listen on $ node app.js

if (!module.parent) server.listen(3000);



var socket = io.listen(server);

var currentMessage = '';

socket.on('connection', function(client){
  client.send(currentMessage);

  client.on('message', function(message){ 
    sys.puts('message received: '+sys.inspect(message));
    currentMessage = message;
    client.broadcast(message);
  });

  client.on('disconnect', function(){ 
    sys.puts('disconnected: '+sys.inspect(arguments));
  });
});
