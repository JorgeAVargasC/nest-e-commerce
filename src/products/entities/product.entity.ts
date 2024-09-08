import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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

	@Column({
		type: 'text',
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
}
