import * as restify from 'restify'
import * as mongoose from 'mongoose';
import * as fs from 'fs';

import { environment } from '../common/environment'
import { Router } from '../common/router';
import { mergePatchBodyParser } from './merge-patch.parser';
import { handleError } from './error.handler'
import { tokenParser } from '../security/token.parser'

export class Server {

    application: restify.Server;

    bootstrap(routes: Router[] = []): Promise<Server> {
        return this.initDb().then(
            () => { 
                return this.initRoutes(routes).then(
                    () => this
                );
            }
        ) 
    }
    
    initDb() {
        (<any>mongoose).Promise = global.Promise;
        return mongoose.connect(environment.server.db.url, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false //TODO
        });
    }

    initRoutes(routes: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {

                const options: restify.ServerOptions = {
                    name: 'meat-api',
                    version: '1.0.0'
                };
                if (environment.server.security.enableHTTPS) {
                    options.certificate = fs.readFileSync(environment.server.security.certificate);
                    options.key = fs.readFileSync(environment.server.security.key);
                }
                this.application = restify.createServer(options);

                this.application.on('restifyError', handleError);

                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(mergePatchBodyParser);
                this.application.use(tokenParser);

                routes.forEach(router => router.apllyRoutes(this.application));

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (err) {
                reject(err);
            }
        })
    }

    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}