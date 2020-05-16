const users = [
    { id: '1', name: 'Peter Park', email: 'peter.park@marvel.com'},
    { id: '2', name: 'Bruce Wayne', email: 'bruce.wayne@dc.com'}
]

export class  User {
    static findAll(): Promise<any[]> {
        return Promise.resolve(users);
    }

    static findById(id: string): Promise<any> {
        return new Promise<any>(
            resolve => {
                const filtered = users.filter( user => user.id === id);

                let user = undefined;

                if(filtered.length > 0)
                    user = filtered[0];

                resolve(user);
            }
        )
    }
}