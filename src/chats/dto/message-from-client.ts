import { IsString, MinLength } from 'class-validator'

export class NewMessageFromClientDto {
	@IsString()
	@MinLength(1)
	msg: string
}
