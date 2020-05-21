import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { User } from './users.model'
import { NotFoundError } from 'restify-errors'

class UsersRouter extends ModelRouter<User> {    

    constructor() {
        super(User);
        
        this.on('beforeRender', document => {
            document.password = undefined;
        })
    }

    apllyRoutes(application: restify.Server) 
    {        
        application.get('/users', this.findAll);
        application.get('/users/:id', [this.validateId, this.findById]);
        application.put('/users/:id', [this.validateId, this.replace]);
        application.del('/users/:id', [this.validateId, this.delete]);
        application.post('/users', this.save);
        application.patch('/users/:id', [this.validateId, this.update]);
    }
}

export const usersRouter = new UsersRouter();