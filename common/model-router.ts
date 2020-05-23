import {Router} from './router';
import * as mongoose from 'mongoose';
import { NotFoundError } from 'restify-errors';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    constructor(protected model: mongoose.Model<D>) {
        super()
    }

    protected prepareAll(query: mongoose.DocumentQuery<D[],D>): mongoose.DocumentQuery<D[],D>{
        return query
    }

    protected prepareOne(query: mongoose.DocumentQuery<D,D>): mongoose.DocumentQuery<D,D>{
        return query
    }

    validateId = (req, resp, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params.id))
            next(new NotFoundError('Documento not found'));
        else
            next();
    }

    findAll = (req, resp, next) => {
        this.prepareAll(this.model.find())
            .then(this.renderAll(resp, next))
            .catch(next);
    };


    findById = (req, resp, next) => {
        this.prepareOne(this.model.findById(req.params.id))
            .then(this.render(resp, next))
            .catch(next);
    };

    save = (req, resp, next) => {
        let document = new this.model(req.body);
        document.save()
            .then(this.render(resp, next))
            .catch(next);
    };

    replace = (req, resp, next) => {
        let document = new this.model(req.body);
        const options = { runValidators: true, overwrite: true };
        this.model.update({_id: req.params.id}, req.body, options).exec().then(
            result => {
                if (result.n)
                    return this.prepareOne(this.model.findById(req.params.id));
                else
                    throw new NotFoundError('Document not found');
            }
        ).then(this.render(resp, next))
         .catch(next);
    }

    update = (req, resp, next) => {
        let document = new this.model(req.body);
    
        const options = { runValidators: true, new: true };
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            .then(this.render(resp, next))
            .catch(next);
    }

    delete = (req, resp, next) => {
        let document = new this.model(req.body);
    
        this.model.deleteOne({_id: req.params.id}, req.body).exec().then(
            (cmdResult: any) => {                    
                if (cmdResult.deletedCount > 0)
                    resp.send(204);
                else                                            
                    throw new NotFoundError('Document not found');
                
                return next();
            }
        ).catch(next);
    }    
}