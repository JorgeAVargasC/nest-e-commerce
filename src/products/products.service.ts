import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger
} from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './entities/product.entity'

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

	async findAll() {
		try {
			const [products, count] = await this.productsRepository.findAndCount()
			return {
				meta: {
					count
				},
				data: products
			}
		} catch (error) {
			this.handleDBException(error)
		}
	}

	async findOne(id: string) {
		try {
			return await this.productsRepository.findOneBy({ id: id.toString() })
		} catch (error) {
			this.handleDBException(error)
		}
	}

	update(id: number, updateProductDto: UpdateProductDto) {
		return updateProductDto
	}

	remove(id: number) {
		return `This action removes a #${id} product`
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
