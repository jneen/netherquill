
/**
 * Module dependencies.
 */

var express = require('express'),
    connect = require('connect'),
    io = require('socket.io');

var sys = require('sys');
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(connect.bodyDecoder());
    app.use(connect.methodOverride());
    app.use(app.router);
    app.use(connect.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(connect.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use(connect.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
    res.render('index.ejs', {
        locals: {
            title: 'Express'
        }
    });
});

var socket = io.listen(app); 
socket.on('connection', function(client){ 
  	client.on('message', function(){ 
		sys.puts(sys.inspect(arguments)) 
	});
  	client.on('disconnect', function(){ 
		sys.puts(sys.inspect(arguments))
	});
});

// Only listen on $ node app.js

if (!module.parent) app.listen(3000);
