import 'jest'
import * as request from 'supertest'
import { Server } from '../server/server'
import { User } from './users.model'
import { environment } from '../common/environment'
import { usersRouter } from './users.router'


let address: string;
let server: Server;

beforeAll(() => {
    environment.server.db.url = process.env.DB_URL || 'mongodb://localhost:27017/meat-api-test'
    environment.server.port = process.env.SERVER_PORT || 3001
    address = `http://localhost:${environment.server.port}`
    server = new Server();
    return server.bootstrap([usersRouter])
            .then(() => User.deleteMany({}).exec())
            .catch(console.error)
})

test('get /users', () => {
    return request(address)
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        })
        .catch(fail);
});

test('post /users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'usuario_01',
            email: 'usuario_01@teste.com.br',
            password: '123456',
            cpf: '123.123.123-87'
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('usuario_01')
            expect(response.body.email).toBe('usuario_01@teste.com.br')
            expect(response.body.cpf).toBe('123.123.123-87')
            expect(response.body.password).toBeUndefined()
        })
        .catch(fail);
});

afterAll(() => {
    return server.shutdown();
})

