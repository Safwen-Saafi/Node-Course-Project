const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
//To get all the functions available in the EventEmitter

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
  console.log('Costumer name: Safwen');
});

myEmitter.on('newSale', (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit('newSale', 9);

//////////////////

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request received!');
  console.log(req.url);
  res.end('Request received');
  if (req.url === '/close') {
    server.close();
  }
});

server.on('request', (req, res) => {
  console.log('Another request 😀');
});

server.on('close', () => {
  console.log('Server closed');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for requests...');
});

//This code demonstrates how to use Node.js's EventEmitter class to create custom events and handle multiple listeners for those events. 
// It also shows how to create a simple HTTP server and handle incoming requests with multiple listeners.
