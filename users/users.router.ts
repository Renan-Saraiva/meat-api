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

    findByEmail = (req, resp, next) => {
        if(req.query.email){
            User.findByEmail(req.query.email)
                .then(user => {
                    return user ? [user] : [];
                })
                .then(this.renderAll(resp, next, {
                    pageSize: this.pageSize,
                    url: req.url
                }))
                .catch(next)
        }
        else
            next();
    }

    apllyRoutes(application: restify.Server) 
    {   
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            { version: '2.0.0', handler: [this.findByEmail, this.findAll] },
            { version: '1.0.0', handler: this.findAll },
        ]));
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        application.post(`${this.basePath}`, this.save);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
    }
}

export const usersRouter = new UsersRouter();