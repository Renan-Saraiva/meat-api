import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { User } from '../users/users.model';
import { environment } from '../common/environment'

const __AuthorizationHeaderName: string = 'authorization';
const __AuthorizationSpliter: string = ' ';
const __AuthorizationBearer: string = 'Bearer';

export const tokenParser: restify.RequestHandler = (req, resp, next) => {
    const token = extractToken(req);

    if (token)
        jwt.verify(token, environment.server.security.apiSecret, applyBearer(req, next));
    else
        return next();
}

function extractToken(req: restify.Request) {
    let token = undefined;
    const authorization = req.header(__AuthorizationHeaderName);
    if (authorization) {
        const parts: string[] = authorization.split(__AuthorizationSpliter);
        if (parts.length === 2 && parts[0] === __AuthorizationBearer)
            token = parts[1];
    }

    return token;
}

function applyBearer(req: restify.Request, next: restify.Next) {
   return (error, decoded): void => {
        if (decoded) {
            User.findByEmail(decoded.sub).then(
                user => {
                    if (user) {
                        (<any>req).authenticated = user;
                    }
                    next();
                }
            )
            .catch(next);
        }
        else
            next();
   }
}