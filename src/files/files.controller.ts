import {
	BadRequestException,
	Controller,
	Post,
	// Param,
	// Delete,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FilesService } from './files.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { fileFilter } from './helpers'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Files')
@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('product')
	@UseInterceptors(
		FileInterceptor('file', {
			fileFilter,
			limits: { fileSize: 1000000 }
			// storage: diskStorage({ destination: './uploads' }) //! to upload in  local machine
		})
	)
	uploadProductImage(@UploadedFile() file: Express.Multer.File) {
		if (!file)
			throw new BadRequestException(
				'Make sure you are uploading a valid image file'
			)

		return this.filesService.uploadFile(file)
	}

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	// 	return this.filesService.deleteImage(+id)
	// }
}
