import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { ProductsModule } from './products/products.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { envs } from './shared/config'
import { SeedModule } from './seed/seed.module'
import { FilesModule } from './files/files.module'
import { AuthModule } from './auth/auth.module'
import { ChatsModule } from './chats/chats.module'

@Module({
	imports: [
		ProductsModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			username: envs.dbUser,
			password: envs.dbPass,
			database: envs.dbName,
			host: envs.dbHost,
			port: envs.dbPort,
			autoLoadEntities: true,
			synchronize: true // ! REMOVE IN PRODUCTION,
		}),
		SeedModule,
		FilesModule,
		AuthModule,
		ChatsModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
