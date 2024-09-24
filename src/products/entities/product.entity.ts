import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { ProductImage } from './product-image.entity'
import { User } from 'src/auth/entities'
import { ApiProperty } from '@nestjs/swagger'

@Entity({
	name: 'products'
})
export class Product {
	@ApiProperty({
		example: 'd0f8a9d0-6a0c-4b2b-9b2f-1b2f1b2f1b2f',
		description: 'Product ID',
		uniqueItems: true
	})
	@PrimaryGeneratedColumn('uuid')
	id: string

	@ApiProperty({
		example: 'T-Shirt',
		description: 'Product title',
		uniqueItems: true
	})
	@Column('text', {
		unique: true
	})
	title: string

	@ApiProperty({
		example: 0,
		description: 'Product price'
	})
	@Column('float', {
		default: 0
	})
	price: number

	@ApiProperty({
		example: 'lorem ipsum',
		description: 'Product description',
		default: null,
		nullable: true
	})
	@Column('text', {
		nullable: true
	})
	description: string

	@ApiProperty({
		example: 't_shirt',
		description: 'Product slug',
		uniqueItems: true
	})
	@Column('text', {
		unique: true
	})
	slug: string

	@ApiProperty({
		example: ['S', 'M', 'XL', 'XXL'],
		description: 'Product sizes'
	})
	@Column('text', {
		array: true
	})
	sizes: string[]

	@ApiProperty({
		example: 'women',
		description: 'Product gender'
	})
	@ApiProperty()
	@Column('text')
	gender: string

	@ApiProperty()
	@Column('text', {
		array: true,
		default: []
	})
	tags: string[]

	//? https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations
	// Eager relations only work when you use find* methods.
	// If you use QueryBuilder eager relations are disabled and
	// have to use leftJoinAndSelect to load the relation.
	// Eager relations can only be used on one side of the
	// relationship, using eager: true
	// on both sides of relationship is disallowed.
	//! eager it doesn't work with createQueryBuilder
	//* eager it works with find* methods, load automatically
	@OneToMany(() => ProductImage, (productImage) => productImage.product, {
		cascade: true,
		eager: true
	})
	images?: ProductImage[]

	@ManyToOne(() => User, (user) => user.products, { eager: true })
	user: User

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@BeforeInsert()
	checkSlugInsert() {
		if (!this.slug) {
			this.slug = this.title
		}
		this.slug = this.slug
			.toLowerCase()
			.replaceAll(' ', '_')
			.replaceAll('-', '_')
			.replaceAll('.', '_')
			.replaceAll("'", '')
			.replaceAll('á', 'a')
			.replaceAll('é', 'e')
			.replaceAll('í', 'i')
			.replaceAll('ó', 'o')
			.replaceAll('ú', 'u')
			.replaceAll('ñ', 'n')
	}

	@BeforeUpdate()
	checkSlugUpdate() {
		this.slug = this.title
			.toLowerCase()
			.replaceAll(' ', '_')
			.replaceAll('-', '_')
			.replaceAll('.', '_')
			.replaceAll("'", '')
			.replaceAll('á', 'a')
			.replaceAll('é', 'e')
			.replaceAll('í', 'i')
			.replaceAll('ó', 'o')
			.replaceAll('ú', 'u')
			.replaceAll('ñ', 'n')
	}
}
