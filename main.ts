import { Server } from './server/server'
import { usersRouter } from './users/users.router'

const server = new Server();

server.bootstrap([usersRouter])
    .then( server => {
        console.log('API is running on:', server.application.address())
    }).catch(err => {
        console.log('Server failed on start');
        console.error(err)
        process.exit(1);        
    });
