import {
	createParamDecorator,
	ExecutionContext,
	InternalServerErrorException
} from '@nestjs/common'

export const GetRawHeaders = createParamDecorator(
	(_data, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest()
		const rawHeaders = req.rawHeaders

		if (!rawHeaders) {
			throw new InternalServerErrorException('Missing Raw Headers (request)')
		}

		return rawHeaders
	}
)
