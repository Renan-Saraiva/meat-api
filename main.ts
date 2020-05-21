import { Server } from './server/server'
import { usersRouter } from './users/users.router'
import { restaurantsRouter } from './restaurants/restaurant.router'

const server = new Server();

server.bootstrap([
        usersRouter,
        restaurantsRouter
    ])
    .then( server => {
        console.log('API is running on:', server.application.address())
    }).catch(err => {
        console.log('Server failed on start');
        console.error(err)
        process.exit(1);        
    });
