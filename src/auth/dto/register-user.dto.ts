import {
	IsEmail,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator'

export class RegisterUserDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6)
	@MaxLength(50)
	@Matches(/(?=.*[\d\W])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'The password must have a Uppercase, lowercase letter and a number'
	})
	password: string

	@IsString()
	@MinLength(1)
	fullName: string
}
