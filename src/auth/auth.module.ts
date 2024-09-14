import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities'

@Module({
	controllers: [AuthController],
	imports: [TypeOrmModule.forFeature([User])],
	providers: [AuthService],
	exports: [TypeOrmModule]
})
export class AuthModule {}
