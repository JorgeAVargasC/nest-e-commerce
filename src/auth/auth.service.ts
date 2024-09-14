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

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
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
			select: { email: true, password: true }
		})

		if (!user)
			throw new UnauthorizedException('Credentials are not valid (email)')

		if (!bcrypt.compareSync(password, user.password)) {
			throw new UnauthorizedException('Credentials are not valid (password)')
		}

		return user
	}

	validateToken(id: number) {
		return `This action returns a #${id} auth`
	}

	refreshToken(id: number, loginUserDto: LoginUserDto) {
		return `This action updates a #${id} auth ${JSON.stringify(loginUserDto)}`
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
