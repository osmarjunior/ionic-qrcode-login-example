const { v4: uuidv4 } = require('uuid');
const server = require('http').createServer();
const io = require('socket.io')(server);
const schedule = require('node-schedule');

server.listen(5000, () => {
  console.log('Server listening at port 5000');
});

const clients = new Map();
var jobsBySocket = {};

io.on('connection', function (socket) {
  console.log('Connected: ' + socket.id);

  socket.on('message', function (msg) {

    var obj = JSON.parse(msg);
    console.log("Receivied:" + JSON.stringify(obj));

    if (obj.op == 'hello') {
      sendToken(socket);
      const job = setInterval(function () {
        console.log('Sending new token to ' + socket.id);
        sendToken(socket);
      }, 10000);
      jobsBySocket[socket] = job;
    }
  });

  socket.on('disconnect', function () {
    clearInterval(jobsBySocket[socket]);
    console.log('Got disconnect!');
  });
});

function sendToken(socket) {
  clients.delete(getByValue(clients, socket));
  var uuidToken = uuidv4();
  clients.set(uuidToken, socket);
  var hello = { op: 'hello', token: uuidToken };
  socket.emit('message', JSON.stringify(hello));
}

function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}

server.on('request', (request, response) => {
  console.log(request);
  response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Request-Method', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	response.setHeader('Access-Control-Allow-Headers', '*');
  response.writeHead(200, { "Content-Type": "text/plain"});
  process.on('uncaughtException', function (err) {
    console.log(err);
    response.end("Exception");
  });
  if (request.method == "POST") {
    var url = request.url;
    if (url == "/auth") {

      var body = '';
      request.on('data', function (chunk) {
        body += chunk.toString();
      });

      request.on('end', function () {
        var params = JSON.parse(body);
        console.log("Recived Params: " + JSON.stringify(params));
        var uuId = params.uuid;
        var accessToken = 'params.access_token';

        var msg = { 'op': 'authdone', 'accessToken': accessToken };
        if (clients.get(uuId) != undefined || clients.get(uuId) != null) {
          console.log("Before " + clients.size);
          clients.get(uuId).emit('message', JSON.stringify(msg));
          clients.delete(uuId);
          console.log("After " + clients.size);

          response.end('{"status":"OK"}');
        } else {
          response.end('{"status":"NOK"}');
        }
      });
    } else {
      response.end('{"status":"NOK"}');
    }
  } else {
    response.end("NOT Supported");
  }
});