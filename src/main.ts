import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { envs } from './shared/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

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

	const config = new DocumentBuilder()
		.setTitle('Nest E Commerce API')
		.setDescription('Nest E Commerce API description')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, config)

	SwaggerModule.setup('api', app, document)

	await app.listen(envs.port)
	logger.log(`Application listening on port: ${envs.port}`)
}

main()
