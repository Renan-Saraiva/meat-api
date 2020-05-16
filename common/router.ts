import * as restify from 'restify'

export abstract class  Router {
    abstract apllyRoutes(application: restify.Server)
}