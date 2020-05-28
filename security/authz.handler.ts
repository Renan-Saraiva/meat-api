import * as restify from 'restify'
import { ForbiddenError } from 'restify-errors'

export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
    return (req, resp, next) => {
        if((<any>req).authenticated !== undefined && (<any>req).authenticated.hasAny(...profiles)){
            req.log.info('User %s authorized.', req.authenticated._id);
            req.log.debug('User %s authorized.', req.authenticated._id);
            next();
        }
        else {
            if (req.authenticated)
                req.log.debug('Permission denied for %s. Required profiles: %j. User profiles: %j.',
                                req.authenticated._id, profiles, req.authenticated.profiles);
            
            next(new ForbiddenError('Permission denied'));
        }
    }
}