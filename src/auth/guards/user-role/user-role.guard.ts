import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { META_ROLES } from 'src/auth/decorators'
import { User } from 'src/auth/entities'

type R = boolean | Promise<boolean> | Observable<boolean>

@Injectable()
export class UserRoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): R {
		const req = context.switchToHttp().getRequest()

		const user = req.user as User
		if (!user) throw new BadRequestException('User not found (request)')

		const userRoles = user.roles

		const validRoles: string[] = this.reflector.get(
			META_ROLES,
			context.getHandler()
		)

		if (!validRoles) return true
		if (validRoles.length === 0) return true

		const isValidRole = userRoles.some((role) => validRoles.includes(role))

		if (!isValidRole)
			throw new ForbiddenException(
				`User (${user.fullName}) need a valid role: [${validRoles}]`
			)

		return isValidRole
	}
}
