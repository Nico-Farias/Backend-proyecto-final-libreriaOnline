export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Libreria Online',
            version: '1.0.0',
            description: 'Aplicacion backend para libreria'
        },
        servers: [
            {
                url: 'http://localhost:4000/api'
            }
        ]
    },
    apis: ['./src/docs/*.yml']
}
