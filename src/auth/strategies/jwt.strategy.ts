import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'

export class JwtStrategy extends PassportStrategy(Strategy) {
	async validate(payload: any) {
		return { userId: payload.sub, username: payload.username }
	}
}
