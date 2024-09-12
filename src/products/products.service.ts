import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException
} from '@nestjs/common'
import { CreateProductDto, UpdateProductDto } from './dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { PaginationDto } from 'src/shared/dto'
import { isUUID } from 'class-validator'
import { Product, ProductImage } from './entities'

@Injectable()
export class ProductsService {
	private readonly logger = new Logger(ProductsService.name)

	constructor(
		@InjectRepository(Product)
		private readonly productsRepository: Repository<Product>,
		@InjectRepository(ProductImage)
		private readonly productsImagesRepository: Repository<ProductImage>,

		private readonly dataSource: DataSource
	) {}

	async create(createProductDto: CreateProductDto) {
		const { images = [], ...productDetails } = createProductDto

		try {
			const product = this.productsRepository.create({
				...productDetails,
				images: images.map((image) =>
					this.productsImagesRepository.create({ url: image })
				)
			})
			await this.productsRepository.save(product)
			return {
				...product,
				images
			}
		} catch (error) {
			this.handleDBException(error)
		}
	}

	async findAll(paginationDto: PaginationDto) {
		try {
			const { page = 1, limit = 10 } = paginationDto
			const [products, count] = await this.productsRepository.findAndCount({
				take: limit,
				skip: limit * (page - 1),
				relations: {
					images: true
				}
			})
			return {
				meta: {
					count,
					totalPages: Math.ceil(count / limit)
				},
				data: products.map(({ images, ...rest }) => ({
					...rest,
					images: images.map((image) => image.url)
				}))
			}
		} catch (error) {
			this.handleDBException(error)
		}
	}

	async findOne(search: string) {
		let product: Product

		if (isUUID(search)) {
			product = await this.productsRepository.findOneBy({
				id: search
			})
		} else {
			// product = await this.productsRepository.findOneBy({ slug: search })
			const queryBuilder = this.productsRepository.createQueryBuilder('prod')
			product = await queryBuilder
				.where('UPPER(title) = :title OR slug = :slug', {
					title: search.toUpperCase(),
					slug: search.toLowerCase()
				})
				.leftJoinAndSelect('prod.images', 'prodImages')
				.getOne()
		}

		if (!product)
			throw new BadRequestException(`Product with search ${search} not found`)

		return product
	}

	async findOnePlain(search: string) {
		const { images = [], ...rest } = await this.findOne(search)
		return {
			...rest,
			images: images.map((image) => image.url)
		}
	}

	async update(id: string, updateProductDto: UpdateProductDto) {
		const { images, ...toUpdate } = updateProductDto

		const product = await this.productsRepository.preload({
			id,
			...toUpdate
		})

		if (!product)
			throw new NotFoundException(`Product with id: ${id} not found`)

		// Create query runner
		const queryRunner = this.dataSource.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()

		try {
			if (images) {
				await queryRunner.manager.delete(ProductImage, {
					product: { id }
				})
				product.images = images.map((image) =>
					this.productsImagesRepository.create({ url: image })
				)
			}

			await queryRunner.manager.save(product)
			await queryRunner.commitTransaction()

			return this.findOnePlain(id)

			// await this.productsRepository.save(product)
		} catch (error) {
			await queryRunner.rollbackTransaction()
			this.handleDBException(error)
		} finally {
			await queryRunner.release()
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

	async deleteAllProducts() {
		const query = this.productsRepository.createQueryBuilder('product')
		try {
			return await query.delete().from(Product).where({}).execute()
		} catch (error) {
			this.handleDBException(error)
		}
	}
}
