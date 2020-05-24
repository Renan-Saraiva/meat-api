import * as jestCli from 'jest-cli'
import { Server } from './server/server'
import { User } from './users/users.model'
import { Review } from './reviews/reviews.model'
import { Restaurant } from './restaurants/restaurants.model'
import { environment } from './common/environment'
import { usersRouter } from './users/users.router'
import { reviewsRouter } from './reviews/reviews.router'
import { restaurantsRouter } from './restaurants/restaurants.router'

let server: Server;

const beforeAllTest = (() => {
    environment.server.db.url = process.env.DB_URL || 'mongodb://localhost:27017/meat-api-test'
    environment.server.port = process.env.SERVER_PORT || 3001
    server = new Server();
    return server.bootstrap([
                usersRouter,
                restaurantsRouter,
                reviewsRouter
            ])
            .then(() => User.deleteMany({}).exec())
            .then(() => Review.deleteMany({}).exec())
            .then(() => Restaurant.deleteMany({}).exec())
})

const afterAllTest = (() => {
    return server.shutdown();
})

//Necessário para controlar o ciclo de vida de teste do JEST
beforeAllTest()
    .then(() => jestCli.run())
    .then(() => setTimeout(afterAllTest,2000))
    .catch(console.error)
    