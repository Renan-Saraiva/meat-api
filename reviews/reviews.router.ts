import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { ModelRouter } from '../common/model-router'
import { Review } from './reviews.model'
import { authorize } from '../security/authz.handler';


class ReviewsRouter extends ModelRouter<Review> {

    constructor() {
        super(Review);
    }

    envelope(document: any): any {
        let resource = super.envelope(document);
        resource._links.restaurant = `restaurants/${resource.restaurant._id ? resource.restaurant._id : resource.restaurant}/menu`;
        resource._links.user = `users/${resource.user._id ? resource.user._id : resource.user}`;
        return resource;
    }

    protected prepareOne(query: mongoose.DocumentQuery<Review,Review>): mongoose.DocumentQuery<Review,Review>{
        return query.populate('user', 'name')
                    .populate('restaurant', 'name')
    }

    protected prepareAll(query: mongoose.DocumentQuery<Review[],Review>): mongoose.DocumentQuery<Review[],Review>{
        return query.populate('user', 'name')
                    .populate('restaurant', 'name')
    }

    apllyRoutes(application: restify.Server) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authorize('user'),this.save]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);

    }
}


export const reviewsRouter = new ReviewsRouter();