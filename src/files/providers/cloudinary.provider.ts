import { v2 as cloudinary } from 'cloudinary'
import { envs } from 'src/shared/config'

export const CloudinaryProvider = {
	provide: 'CLOUDINARY',
	useFactory: () => {
		return cloudinary.config({
			cloud_name: envs.cloudinaryCloudName,
			api_key: envs.cloudinaryApiKey,
			api_secret: envs.cloudinaryApiSecret
		})
	}
}
