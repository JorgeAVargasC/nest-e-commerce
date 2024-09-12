import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'

// when you rename a table in development probably you need to
// down the server and delete the db container and recreate it
// docker-compose up -d && yarn start:dev
@Entity({
	name: 'product_images'
})
export class ProductImage {
	@PrimaryGeneratedColumn()
	id: number

	@Column('text')
	url: string

	@ManyToOne(() => Product, (product) => product.images, {
		onDelete: 'CASCADE'
	})
	product: Product
}
