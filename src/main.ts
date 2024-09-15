import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { envs } from './shared/config'

async function main() {
	const logger = new Logger(AppModule.name)
	const app = await NestFactory.create(AppModule)

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true
		})
	)


	app.setGlobalPrefix('api/v1')

	await app.listen(envs.port)
	logger.log(`Application listening on port: ${envs.port}`)
}

main()
