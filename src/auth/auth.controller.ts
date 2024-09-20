import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginUserDto, RegisterUserDto } from './dto'
import { AuthGuard } from '@nestjs/passport'

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
	privateRoute() {
		return {
			ok: true,
			message: 'This is private route'
		}
	}
}
