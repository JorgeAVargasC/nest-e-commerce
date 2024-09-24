import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class FilesService {
	async uploadFile(file: Express.Multer.File) {
		try {
			const base64file = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
			const result = await cloudinary.uploader.upload(base64file, {
				public_id: file.filename
			})
			console.log(result)

			const optimizeUrl = cloudinary.url(result.public_id, {
				transformation: [
					{
						quality: 'auto',
						fetch_format: 'auto'
					},
					{
						width: 300,
						height: 300,
						crop: 'fill',
						gravity: 'auto'
					}
				]
			})

			return {
				url: optimizeUrl
			}
		} catch (error) {
			throw new InternalServerErrorException(error)
		}
	}

	// async deleteImage(id: string): Promise<string> {
	// 	try {
	// 		await cloudinary.uploader.destroy(id)
	// 		return `The image with the id: ${id} was removed from cloudinary`
	// 	} catch (error) {
	// 		throw new NotFoundException('The image could not be deleted.')
	// 	}
	// }
}
