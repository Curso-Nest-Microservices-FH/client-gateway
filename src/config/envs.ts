import 'dotenv/config'
import * as joi from 'joi'

// Joi se usa para hacer validaciones de las variables de entorno

interface EnvVars {
    PORT: number;


    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    PORT: joi.number().required(),

    NATS_SERVERS: joi.array().items(joi.string()).required()
})

.unknown(true) // permite evadir las validaciones a todas las otras variables de entorno

const {error, value} = envsSchema.validate(
    {   
        ...process.env,
        NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
        
    }
)

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
    
}

const envVars: EnvVars = value

export const envs = {
    port: envVars.PORT,


    natsServers: envVars.NATS_SERVERS
}