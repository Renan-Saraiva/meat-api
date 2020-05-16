import * as restify from 'restify'
import { environment } from '../common/environment'
import { Router } from '../common/router'

export class Server {

    application: restify.Server;

    bootstrap(routes: Router[] = []): Promise<Server> {
        return this.initRoutes(routes).then(() => this);
    }

    initRoutes(routes: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })

                this.application.use(restify.plugins.queryParser());

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