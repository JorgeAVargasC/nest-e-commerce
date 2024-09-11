import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'
import { ProductImage } from './product-image.entity'

@Entity()
export class Product {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column('text', {
		unique: true
	})
	title: string

	@Column('float', {
		default: 0
	})
	price: number

	@Column('text', {
		nullable: true
	})
	description: string

	@Column('text', {
		unique: true
	})
	slug: string

	@Column('text', {
		array: true
	})
	sizes: string[]

	@Column('text')
	gender: string

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
	//* eager it works with find* methods
	@OneToMany(() => ProductImage, (productImage) => productImage.product, {
		cascade: true,
		eager: true
	})
	images?: ProductImage[]

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
