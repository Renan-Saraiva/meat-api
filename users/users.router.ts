import { Router } from '../common/router'
import * as restify from 'restify'
import { User } from './users.model'
import { NotFoundError } from 'restify-errors'

class UsersRouter extends Router {    


    constructor() {
        super();
        
        this.on('beforeRender', document => {
            document.password = undefined;
        })
    }


    apllyRoutes(application: restify.Server) {
        
        application.get('/users', (req, resp, next) => {
            User.find().then(this.render(resp, next)).catch(next);
        });

        application.get('/users/:id', (req, resp, next) => {
            User.findById(req.params.id).then(this.render(resp, next)).catch(next);
        });

        application.post('/users', (req, resp, next) => {
            let user = new User(req.body);
            user.save().then(this.render(resp, next)).catch(next);
        });

        application.put('/users/:id', (req, resp, next) => {
            let user = new User(req.body);

            const options = { runValidators: true, overwrite: true };
            User.update({_id: req.params.id}, req.body, options).exec().then(
                result => {
                    if (result.n)
                        return User.findById(req.params.id);
                    else
                        throw new NotFoundError('Document not found');
                }
            ).then(this.render(resp, next))
             .catch(next);
        });

        application.patch('/users/:id', (req, resp, next) => {
            let user = new User(req.body);
        
            const options = { runValidators: true, new: true };
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        });

        application.del('/users/:id', (req, resp, next) => {
            let user = new User(req.body);
        
            User.deleteOne({_id: req.params.id}, req.body).exec().then(
                (cmdResult: any) => {                    
                    if (cmdResult.deletedCount > 0)
                        resp.send(204);
                    else                                            
                        throw new NotFoundError('Document not found');
                    
                    return next();
                }
            ).catch(next);
        });
    }
}

export const usersRouter = new UsersRouter();