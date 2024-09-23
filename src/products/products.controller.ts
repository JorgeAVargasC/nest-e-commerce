import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseUUIDPipe,
	Query
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PaginationDto } from '../shared/dto'
import { Auth, GetUser } from '../auth/decorators'
import { ValidRoles } from '../auth/interfaces'
import { User } from '../auth/entities'

@Controller('products')
// @Auth() all routes will be protected
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@Auth()
	create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
		return this.productsService.create(createProductDto, user)
	}

	@Get()
	findAll(@Query() paginationDto: PaginationDto) {
		return this.productsService.findAll(paginationDto)
	}

	@Get(':search')
	findOne(@Param('search') search: string) {
		return this.productsService.findOnePlain(search)
	}

	@Patch(':id')
	@Auth()
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateProductDto: UpdateProductDto,
		@GetUser() user: User
	) {
		return this.productsService.update(id, updateProductDto, user)
	}

	@Delete(':id')
	@Auth(ValidRoles.ADMIN)
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.productsService.remove(id)
	}
}
