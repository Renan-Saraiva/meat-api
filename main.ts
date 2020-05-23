import { Server } from './server/server'
import { usersRouter } from './users/users.router'
import { restaurantsRouter } from './restaurants/restaurants.router'
import { reviewsRouter } from './reviews/reviews.router'

const server = new Server();

server.bootstrap([
        usersRouter,
        restaurantsRouter,
        reviewsRouter
    ])
    .then( server => {
        console.log('API is running on:', server.application.address())
    }).catch(err => {
        console.log('Server failed on start');
        console.error(err)
        process.exit(1);        
    });
