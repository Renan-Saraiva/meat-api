import * as restify from 'restify'
import { environment } from '../common/environment'
import { Router } from '../common/router';
import { mergePatchBodyParser } from './merge-patch.parser';
import * as mongoose from 'mongoose';

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
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    initRoutes(routes: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })

                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(mergePatchBodyParser);

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
}