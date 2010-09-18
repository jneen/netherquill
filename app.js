
/**
 * Module dependencies.
 */

var http = require('http'),
    io = require('socket.io'),
    ejs = require('ejs'),
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
  client.send(JSON.stringify($dmp.patch_make('', currentMessage)));

  client.on('message', function(message){ 
    sys.puts('message received: '+sys.inspect(message));
    var patch = JSON.parse(message);
    currentMessage = $dmp.patch_apply(patch, currentMessage)[0];
    client.broadcast(message);
  }); 
  client.on('disconnect', function(){ 
    sys.puts('disconnected: '+sys.inspect(arguments));
  });
});
