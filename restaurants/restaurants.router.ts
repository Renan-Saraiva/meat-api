import { ModelRouter } from '../common/model-router'
import * as restify from 'restify'
import { Restaurant } from './restaurants.model'
import { NotFoundError } from 'restify-errors'


class RestaurantsRouter extends ModelRouter<Restaurant> {    

    constructor() {
        super(Restaurant);    
    }

    envelope(document: any): any {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }

    findMenu = (req, resp, next) => {
        Restaurant.findById(req.params.id, "+menu")
            .then(restaurant => {
                if(!restaurant) {
                    throw new NotFoundError('Restaurant not foud')
                }
                else {
                    resp.json(restaurant.menu);
                    return next();
                }
            }).catch(next);
    }

    replaceMenu = (req, resp, next) => {
        Restaurant.findById(req.params.id)
            .then(restaurant => {
                if(!restaurant) {
                    throw new NotFoundError('Restaurant not foud')
                }
                else {
                    restaurant.menu = req.body;
                    return restaurant.save();                   
                }
            })
            .then(restaurant => {
                resp.json(restaurant.menu);
                return next();
            })
            .catch(next);
    }

    apllyRoutes(application: restify.Server) 
    {        
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        application.post(`${this.basePath}`, this.save);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu]);
    }
}

export const restaurantsRouter = new RestaurantsRouter();