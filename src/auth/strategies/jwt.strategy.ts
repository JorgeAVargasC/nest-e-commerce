import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { IJwtPayload } from '../interfaces'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities'
import { Repository } from 'typeorm'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { envs } from 'src/shared/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: envs.jwtSecret
		})
	}

	async validate(payload: IJwtPayload): Promise<any> {
		const { id } = payload
		const user = await this.userRepository.findOneBy({ id })
		if (!user) {
			throw new UnauthorizedException('Token not valid')
		}

		if (!user.isActive) {
			throw new UnauthorizedException('User is inactive, talk with an admin')
		}

		return {
			...user,
			extra: 'HI FROM JWT STRATEGY'
		}
	}
}
