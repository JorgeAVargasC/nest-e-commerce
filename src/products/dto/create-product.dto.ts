import { ApiProperty } from '@nestjs/swagger'
import {
	IsArray,
	IsIn,
	IsInt,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	MinLength
} from 'class-validator'

export class CreateProductDto {
	@ApiProperty({
		example: 'T-Shirt',
		description: 'Product title',
		uniqueItems: true,
		nullable: false,
		required: true,
		minLength: 1
	})
	@IsString()
	@MinLength(1)
	title: string

	@ApiProperty()
	@IsString({ each: true })
	@IsArray()
	sizes: string[]

	@ApiProperty({
		description: 'Product gender',
		enum: ['men', 'women', 'kid', 'unisex'],
		default: 'women',
		nullable: false
	})
	@IsIn(['men', 'women', 'kid', 'unisex'])
	gender: string

	@ApiProperty({
		required: false
	})
	@IsNumber()
	@IsPositive()
	@IsOptional()
	price?: number

	@ApiProperty()
	@IsString()
	@IsOptional()
	description?: string

	@ApiProperty()
	@IsString()
	@IsOptional()
	slug?: string

	@ApiProperty()
	@IsInt()
	@IsPositive()
	@IsOptional()
	stock?: number

	@ApiProperty()
	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	tags?: string[]

	@ApiProperty()
	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	images?: string[]
}
