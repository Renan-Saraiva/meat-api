export const environment = {
    //TODO: Avaliar ENV e aplicar no DOcker
    server: {
        port: process.env.SERVER_PORT || 3000,
        db: {
            url: process.env.DB_URL || 'mongodb://localhost:27017/meat-api'
        },
        security: {
            saltRounds: process.env.SALT_ROUNDS || 10
        }
    }
}