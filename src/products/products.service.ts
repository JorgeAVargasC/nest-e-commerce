import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException
} from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './entities/product.entity'
import { PaginationDto } from 'src/shared/dto'
import { isUUID } from 'class-validator'

@Injectable()
export class ProductsService {
	private readonly logger = new Logger(ProductsService.name)

	constructor(
		@InjectRepository(Product)
		private readonly productsRepository: Repository<Product>
	) {}

	async create(createProductDto: CreateProductDto) {
		try {
			const product = this.productsRepository.create(createProductDto)
			await this.productsRepository.save(product)
			return product
		} catch (error) {
			this.handleDBException(error)
		}
	}

	async findAll(paginationDto: PaginationDto) {
		try {
			const { page = 1, limit = 10 } = paginationDto
			const [products, count] = await this.productsRepository.findAndCount({
				take: limit,
				skip: limit * (page - 1)
			})
			return {
				meta: {
					count,
					totalPages: Math.ceil(count / limit)
				},
				data: products
			}
		} catch (error) {
			this.handleDBException(error)
		}
	}

	async findOne(search: string) {
		let product: Product

		if (isUUID(search)) {
			product = await this.productsRepository.findOneBy({ id: search })
		} else {
			// product = await this.productsRepository.findOneBy({ slug: search })
			const queryBuilder = this.productsRepository.createQueryBuilder()
			product = await queryBuilder
				.where('UPPER(title) = :title OR slug = :slug', {
					title: search.toUpperCase(),
					slug: search.toLowerCase()
				})
				.getOne()
		}

		if (!product)
			throw new BadRequestException(`Product with search ${search} not found`)

		return product
	}

	async update(id: string, updateProductDto: UpdateProductDto) {
		const product = await this.productsRepository.preload({
			id,
			...updateProductDto
		})

		if (!product)
			throw new NotFoundException(`Product with id: ${id} not found`)

		try {
			return await this.productsRepository.save(product)
		} catch (error) {
			this.handleDBException(error)
		}
	}

	async remove(id: string) {
		const product = await this.findOne(id)
		await this.productsRepository.remove(product)
	}

	private handleDBException(error: any) {
		if (error.code === '23505') {
			throw new BadRequestException(error.detail)
		}
		this.logger.error(error)
		throw new InternalServerErrorException(
			'Unexpected error, check server logs'
		)
	}
}
