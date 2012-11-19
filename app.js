var express = require('express'),
    routes = require('./routes'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/slave', routes.slave);

var master = null;

io.sockets.on('connection', function (socket) {
  socket.on('master', function () {
    master = socket;
  });

  socket.on('mouseMoved', function (x, y) {
    if(master)
      master.emit('mouseMoved', x, y);
  });

  socket.on('mouseDown', function (x, y) {
    if(master)
      master.emit('mouseDown', x, y);
  });

  socket.on('mouseUp', function (x, y) {
    if(master)
      master.emit('mouseUp', x, y);
  });

  socket.on('disconnect', function () {
    if(master && master.id === socket.id)
      master = null;
  });
});

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
