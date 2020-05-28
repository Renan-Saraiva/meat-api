import * as restify from 'restify'
import { ModelRouter } from '../common/model-router'
import { User } from './users.model'
import { authenticate } from '../security/auth.handler'
import { authorize } from '../security/authz.handler'

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User);

        this.on('beforeRender', document => {
            document.password = undefined;
        })
    }

    findByEmail = (req, resp, next) => {
        if (req.query.email) {
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

    apllyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, restify.plugins.conditionalHandler([
            {
                version: '2.0.0', handler: [
                    authorize('admin'),
                    this.findByEmail,
                    this.findAll
                ]
            },
            { version: '1.0.0', handler: [authorize('admin'), this.findAll] },
        ]));
        application.get(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.findById]);
        application.put(`${this.basePath}/:id`, [authorize('admin','user'), this.validateId, this.replace]);
        application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete]);
        application.post(`${this.basePath}`, [this.save]);
        application.patch(`${this.basePath}/:id`, [authorize('admin','user'), this.validateId, this.update]); //TODO: Validar se é o proprio usuário que está se altereando
        application.post(`${this.basePath}/authenticate`, authenticate);
    }
}

export const usersRouter = new UsersRouter();