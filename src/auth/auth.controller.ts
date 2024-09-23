import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	UseGuards,
	Headers
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginUserDto, RegisterUserDto } from './dto'
import { AuthGuard } from '@nestjs/passport'
import { Auth, GetRawHeaders, GetUser, RoleProtected } from './decorators'
import { User } from './entities'
import { IncomingHttpHeaders } from 'http2'
import { UserRoleGuard } from './guards/user-role'
import { ValidRoles } from './interfaces'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	register(@Body() registerUserDto: RegisterUserDto) {
		return this.authService.register(registerUserDto)
	}

	@Post('login')
	login(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto)
	}

	@Get('validate/:id')
	validateToken(@Param('id') id: string) {
		return this.authService.validateToken(+id)
	}

	@Patch('refresh/:id')
	refreshToken(@Param('id') id: string, @Body() loginUserDto: LoginUserDto) {
		return this.authService.refreshToken(+id, loginUserDto)
	}

	// private route
	@Get('private')
	@UseGuards(AuthGuard())
	privateRoute(
		@GetUser() user: User,
		@GetUser('email') userEmail: string,
		@GetRawHeaders() rawHeaders: string[],
		@Headers() headers: IncomingHttpHeaders
	) {
		return {
			ok: true,
			message: 'This is private route',
			user,
			userEmail,
			rawHeaders,
			headers
		}
	}

	// private route 2
	@Get('private2')
	// @SetMetadata('roles', ['admin', 'super-user'])
	@RoleProtected(ValidRoles.ADMIN)
	@UseGuards(AuthGuard(), UserRoleGuard)
	privateRoute2(@GetUser() user: User) {
		return {
			ok: true,
			message: 'This is private route 2',
			user
		}
	}

	// private route 3
	@Get('private3')
	@Auth(ValidRoles.ADMIN, ValidRoles.SUPER_USER)
	privateRoute3(@GetUser() user: User) {
		return {
			ok: true,
			message: 'This is private route 2',
			user
		}
	}
}
