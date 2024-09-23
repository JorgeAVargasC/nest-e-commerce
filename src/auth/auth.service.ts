import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities'
import { Repository } from 'typeorm'

import * as bcrypt from 'bcrypt'
import { LoginUserDto, RegisterUserDto } from './dto'
import { IJwtPayload } from './interfaces'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		private readonly jwtService: JwtService
	) {}

	private readonly logger = new Logger(AuthService.name)

	async register(createUserDto: RegisterUserDto) {
		try {
			const { password, ...userData } = createUserDto

			const user = this.userRepository.create({
				...userData,
				password: bcrypt.hashSync(password, 10)
			})

			await this.userRepository.save(user)

			delete user.password
			delete user.isActive

			return user
		} catch (error) {
			this.handleDBErrors(error)
		}
	}

	async login(loginUserDto: LoginUserDto) {
		const { email, password } = loginUserDto

		const user = await this.userRepository.findOne({
			where: { email },
			select: { email: true, id: true, password: true, fullName: true }
		})

		if (!user)
			throw new UnauthorizedException('Credentials are not valid (email)')

		if (!bcrypt.compareSync(password, user.password)) {
			throw new UnauthorizedException('Credentials are not valid (password)')
		}

		delete user.password

		return {
			user,
			token: this.getJwtToken({
				id: user.id
			})
		}
	}

	validateToken(id: number) {
		return `This action returns a #${id} auth`
	}

	refreshToken(user: User) {
		return {
			...user,
			token: this.getJwtToken({
				id: user.id
			})
		}
	}

	private getJwtToken(payload: IJwtPayload) {
		return this.jwtService.sign(payload)
	}

	private handleDBErrors(error: any): never {
		if (error.code === '23505') {
			this.logger.error(error.detail)
			throw new BadRequestException(error.detail)
		}

		this.logger.error(error)
		throw new InternalServerErrorException('Please check server logs')
	}
}
