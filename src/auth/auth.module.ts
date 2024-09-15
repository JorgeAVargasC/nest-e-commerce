import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { envs } from 'src/shared/config'

@Module({
	controllers: [AuthController],
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: envs.jwtSecret,
			signOptions: { expiresIn: '1h' }
		})
	],
	providers: [AuthService],
	exports: [TypeOrmModule]
})
export class AuthModule {}
