import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { envs } from './shared/config'

async function main() {
	const app = await NestFactory.create(AppModule)

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true
		})
	)

	app.setGlobalPrefix('api/v1')

	await app.listen(envs.port)
}

main()
