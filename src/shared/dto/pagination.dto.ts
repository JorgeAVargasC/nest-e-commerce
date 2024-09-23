import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsPositive } from 'class-validator'

export class PaginationDto {
	@ApiProperty({
		default: 10,
		description: 'How many items do you need',
		required: false
	})
	@IsOptional()
	@IsPositive()
	@Type(() => Number)
	limit?: number

	@ApiProperty({
		default: 1,
		description: 'Which page do you need',
		required: false
	})
	@IsOptional()
	@IsPositive()
	@Type(() => Number)
	page?: number
}
