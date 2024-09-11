import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

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
