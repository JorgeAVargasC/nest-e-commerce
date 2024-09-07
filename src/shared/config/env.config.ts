import 'dotenv/config'
import * as joi from 'joi'

interface IEnv {
	PORT: number
	DB_USER: string
	DB_PASS: string
	DB_NAME: string
	DB_HOST: string
	DB_PORT: number
}

const envSchema = joi
	.object({
		PORT: joi.number().required(),
		DB_USER: joi.string().required(),
		DB_PASS: joi.string().required(),
		DB_NAME: joi.string().required(),
		DB_HOST: joi.string().required(),
		DB_PORT: joi.number().required()
	})
	.unknown(true)

const { error, value } = envSchema.validate(process.env)

if (error) {
	throw new Error(`Config validation error: ${error.message}`)
}

const envVars: IEnv = value

export const envs = {
	port: envVars.PORT,
	dbUser: envVars.DB_USER,
	dbPass: envVars.DB_PASS,
	dbName: envVars.DB_NAME,
	dbHost: envVars.DB_HOST,
	dbPort: envVars.DB_PORT
}
