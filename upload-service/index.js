const Hapi = require('hapi');
const mongooseStore = require('./plugins/mongooseStore');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('hello, there');
    }
});

server.route({
    method: 'POST',
    path: '/submit',
    handler: function (request, reply) {
        const { content } = request.payload;
        console.log(content);
        reply();
    }
});

server.register({
    register: mongooseStore,
    options: {
        uri: 'mongodb://localhost:27017/dms'
    }
}, err => {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });
});
